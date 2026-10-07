const Contact = require("../models/Contact");
const Mission = require("../models/Mission");
const User = require("../models/User")
const HistoryNote = require("../models/HistoryNote");
const { scheduleNextMission, findOptimalMissionDay } = require("../utils/scheduleNextMission")
const { updateUpcomingMission } = require("../utils/updateUpcomingMission") ;

module.exports = {
  getMissionList: async (req, res) => {
    try{
      if(!req.user.id){
        res.status(401).json({message: "User logged out"});
        return;
      }
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      const missions = await Mission.find({
        user: req.user.id,
        scheduledFor: { $lte: today }, //today or earlier
        missionStatus: { $ne: "complete" },
      })
      .populate("contact")
      .lean();

      const completedList = await Mission.find({
        user: req.user.id,
        missionStatus: "complete",
      })
      .limit(20)
      .sort({ completedAt: -1 })
      .populate("contact")
      .lean();

      const now = new Date();
      //Start of today
      const startOfDay = new Date(now);
      startOfDay.setHours(0,0,0,0);

      //Start of week (Sunday)
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0,0,0,0);

      //Start of month
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const statsResult = await Mission.aggregate([
        {
          $match: {
            user: req.user._id,
            missionStatus: "complete",
          },
        },
        {
          $group: {
      _id: null,
      month: {
        $sum: {
          $cond: [{ $and: [
                { $ne: ["$completedAt", null] },
                { $gte: ["$completedAt", startOfMonth] },
              ], }, 1, 0],
        },
      },
      week: {
        $sum: {
          $cond: [{ $and: [
                { $ne: ["$completedAt", null] },
                { $gte: ["$completedAt", startOfWeek] },
              ], }, 1, 0],
        },
      },
      today: {
        $sum: {
          $cond: [{ $and: [
                { $ne: ["$completedAt", null] },
                { $gte: ["$completedAt", startOfDay] },
              ], }, 1, 0],
        },
      },
    },
        },
      ])
      const userStats =await User.findById(req.user._id)

      const statistics = {
        total: userStats.stats.totalCompleted,
        month: statsResult[0] ? statsResult[0].month : 0,
        week: statsResult[0] ? statsResult[0].week : 0, 
        today: statsResult[0] ? statsResult[0].today : 0,
        streak: userStats.stats.streak,
        longestStreak: userStats.stats.longestStreak,
      };


      res.status(200).json({missionList: missions, completedList, statistics });
    } catch (err) {
      console.log(err);
    }
    
  },
  createMission: async (req, res) => {
    try{
      if(!req.body.missionContact){
        res.status(400).json({message: "Mission not created. Missing existing contact"});
        return;
      }
      if(!req.body.scheduledFor){
        res.status(400).json({message: "Mission not created. Missing date input"});
        return;
      }
      if(!req.body.missionType){
        res.status(400).json({message: "Mission not created. No mission type"});
        return;
      }
      const contactPerson = await Contact.findOne({user: req.user.id, _id: req.body.missionContact }).lean();
      
      const contactMap = {
        contact: contactPerson.preferredMethod,
        field: null,
      }

      const [year, month, day] = req.body.scheduledFor.split("-").map(Number);

const safeDate = new Date(Date.UTC(
  year,
  month - 1, // JS months are 0-based
  day,
  12, 0, 0   // noon UTC
));
      const newMission = await Mission.create({
        user: req.user.id,
        contact: contactPerson._id,
        scheduledFor: safeDate,
        missionType: req.body.missionType,
        contactMethod: contactMap[req.body.missionType],
        missionStatus: "new",
      });
      console.log("Mission created!");
      await updateUpcomingMission(contactPerson, newMission);
      res.status(201).json({message: "Mission created!"});
    } catch (err) {
      console.log(err);
      res.status(500).json({message: "Request failed"});
    }    
  },
  getMissionDetails: async (req, res) => {
    try{
      const mission = await Mission.findOne({user: req.user.id, _id: req.params.id})
        .populate("contact")
        .lean();

      const history = await HistoryNote.find({user: req.user.id, contact: mission.contact._id})
        .sort({ createdAt: -1 })
        .lean();

      res.json({ mission, history});
    } catch (err){
      console.log(err);
    }
  },
  searchContacts: async (req, res)=>{
    try{
      const q = req.query.query;

      const contacts = await Contact.find({
        user: req.user.id,
        $or: [
            { firstName: new RegExp(q, "i") },
            { lastName: new RegExp(q, "i") },
            { nickname: new RegExp(q, "i") }
        ]
      })
      .select("firstName lastName nickname _id image connectionInstinct")
      .lean();

      res.json(contacts);
    } catch (err){
      console.log(err);
    }
  },
  completeMission: async (req, res) => {
    try {
      if(!req.params.id){
        res.status(400).json({message: "Snooze failed. Missing mission id"});
        return;
      }
      if(!req.body.debriefContactId){
        res.status(400).json({message: "Snooze failed. Missing contact"});
        return;
      }
      if(!req.body.debriefNotes){
        res.status(400).json({message: "Snooze failed. Missing notes about mission experience"});
        return;
      }
      if(!req.body.debriefMissionType){
        res.status(400).json({message: "Snooze failed. Missing mission type"});
        return;
      }
      const missionId = req.params.id;
      const today = new Date();
      await Mission.findOneAndUpdate({user: req.user.id,
        _id: missionId},
        { missionStatus: "complete", completedAt: today },
        {new: true}
      );

      await HistoryNote.create({
        mission: missionId,
        contact: req.body.debriefContactId,
        noteText: req.body.debriefNotes,
        user: req.user._id,
        createdAt: today,
        missionType: req.body.debriefMissionType,
      });
      const user = await User.findById(req.user._id)
      
      await Contact.findOneAndUpdate({user: req.user.id, _id: req.body.debriefContactId}, {lastContact: today}, {new: true});
      today.setHours(0,0,0,0);

      let updateLongestStreak = user.stats.longestStreak;
      let updateStreak = user.stats.streak;

      const last = user.stats.lastCompletedDate
        ? new Date(user.stats.lastCompletedDate)
        : null;

      if (last) last.setHours(0,0,0,0);

      const diffDays = last
        ? (today - last) / (1000 * 60 * 60 * 24)
        : null;

      // Update streak
      if (diffDays === 1) {
        updateStreak += 1;
      } else if (diffDays === 0) {
      // same day → no change
      } else {
        updateStreak = 1;
      }

      // Update longest
      updateLongestStreak = Math.max(
        user.stats.longestStreak,
        updateStreak
      );

      const updateTotalCompleted = user.stats.totalCompleted + 1;

      await User.findByIdAndUpdate(
        req.user.id,
        {stats:{
          totalCompleted: updateTotalCompleted,
          streak: updateStreak,
          longestStreak: updateLongestStreak,
          lastCompletedDate: today
        }}
      )
      await scheduleNextMission(req.user.id, req.body.    debriefContactId);
      res.status(200).json({message: "Mission complete!"});
    } catch (err) {
      console.log(err);
      res.status(500).json({message: "Request failed"});
    }
  },
  snoozeMission: async (req, res) => {
    try{
      if(!req.params.id){
        res.status(400).json({message: "Snooze failed. Missing contact"});
        return;
      }
      //look at user's last mission complete date
      const mission = await Mission.findOne({user: req.user.id, _id: req.params.id})
        .populate("contact")
        .lean();
      let prevMission = mission.contact.lastContact ? new Date(mission.contact.lastContact): null;

      const mostAvailableDay = await findOptimalMissionDay(prevMission, mission.contact, req.user.id)

      //update mission, don't need to update contact's next mission because it is already tied to this mission's Id
      await Mission.findOneAndUpdate({user: req.user.id, _id: req.params.id}, {scheduledFor: mostAvailableDay})
      res.status(200).json({message: "Mission rescheduled!"});
    } catch (err) {
      console.log(err);
      res.status(500).json({message: "Request failed"});
    }
  }
};