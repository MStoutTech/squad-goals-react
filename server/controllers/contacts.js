const Contact = require("../models/Contact");
const HistoryNote = require("../models/HistoryNote");
const User = require("../models/User");
const Evaluation = require("../models/Evaluation");
const { scheduleNextMission } = require("../utils/scheduleNextMission");
const { calculateContactScores } = require("../utils/calculateContactScores");


module.exports = {
  getSquad: async (req, res) => {
    try {
      const contacts = await Contact.find({ user: req.user.id }).populate("nextMission").lean();
      const heartCoreList = contacts.filter(contact => contact.friendList ? contact.friendList === "heartCore" : contact.connectionInstinct === "heartCore");
      const rayLiablesList = contacts.filter(contact => contact.friendList ? contact.friendList === "rayLiables" : contact.connectionInstinct === "rayLiables");
      const buddiesList = contacts.filter(contact => contact.friendList ? contact.friendList === "buddies" : contact.connectionInstinct === "buddies");
      const evalQuestionCount = await Evaluation.countDocuments({isActive: true});
      let userQuery = User.findById(req.user.id);
      for (const role of Object.keys(req.user.friendshipRoles)) {
        userQuery = userQuery.populate(`friendshipRoles.${role}`, "firstName lastName image");
      }
      
      const populatedUser = await userQuery.lean();
      const userTags = req.user.tags || [];
      const evalTags = (await Evaluation.find({questionType: "categorical"}).lean()).flatMap(q=> q.options.map(o=>o.text))

      res.status(200).json({heartCoreList: heartCoreList, rayLiablesList: rayLiablesList, buddiesList: buddiesList, friendshipRoles: populatedUser.friendshipRoles, tags: userTags, evalTags: evalTags, evalQuestionCount: evalQuestionCount})
    } catch (err) {
      console.log(err);
    }
    
  },
  createContact: async (req, res) => {
    try{
      const contacts = await Contact.find({ user: req.user.id }).lean();
      if (contacts.length >= 150){
        console.log("Contact limit reached!");
        res.status(409).json({message: "Contact limit reached!"});
      } else {
      if(!req.body.connectionInstinct){
        res.status(400).json({message: "Contact not added. Missing connection instinct"});
        return;
      }
      if(!req.body.firstName){
        res.status(400).json({message: "Contact not added. Missing first name"});
        return;
      }
      if(!req.body.lastName){
        res.status(400).json({message: "Contact not added. Missing last name"});
        return;
      }
      if(!req.body.preferredMethod){
        res.status(400).json({message: "Contact not added. Missing preferred contact method"});
        return;
      }
      const instinct = req.body.connectionInstinct;
      const instinctMap = {
        heartCore: { evalScore: 100, contactFrequency: 'weekly'},
        rayLiables: { evalScore: 50, contactFrequency: 'monthly'},
        buddies: { evalScore: 25, contactFrequency: 'quarterly'}
      };
      const { evalScore, contactFrequency } = instinctMap[instinct]

      const newContact = await Contact.create({
        user: req.user.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nickname: req.body.nickname,
        preferredMethod: req.body.preferredMethod,
        connectionInstinct: instinct,
        evalScore: evalScore,
        contactFrequency: contactFrequency
      });
      await scheduleNextMission(req.user.id, newContact._id)
      res.status(201).json({message: "Contact added!"});
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({message: "Request failed"});
    }
  },
  getHistory: async (req, res) => {
    try {
      if(!req.params.id){
        res.status(400).json({message: "Cannot find mission history. Missing contact"});
        return;
      }
      
      const contactHistory = await HistoryNote.find({ user: req.user.id, contact: req.params.id }).sort({ createdAt: -1 }).lean();

      res.status(200).json(contactHistory)
    } catch (err) {
      console.log(err);
      res.status(500).json({message: "Request failed"});
    }
  },
  setFriendshipRoles: async (req, res) => {
    try{
      //store new roles from req on user
      const newRoles = req.body;

      const userUpdate = {};
      for (const role of Object.keys(req.body)){
        userUpdate[`friendshipRoles.${role}`] = newRoles[role] || null;
      }

      await User.findByIdAndUpdate(
              req.user.id,
              userUpdate,
              {new: true}
            );

      //before assigning a roles, verify no other contact has that role on the user and clean up.
      await Contact.updateMany(
        {user: req.user.id, friendshipRole: {$ne: null}},
        {friendshipRole: null}
      )

      //add new roles to specified contacts that were added to user
    for(const role of Object.keys(req.body)){
        if(req.body[role]){ 
          await Contact.findOneAndUpdate({user: req.user.id, _id:req.body[role]}, {friendshipRole: role});
        }
    }
      await calculateContactScores(req.user.id);
      
      res.status(200).json({message: "Friendship Roles Saved!"});
    }catch(err){
      console.log(err);
      res.status(500).json({message: "Request failed"});
    }
  },
  editContact: async (req, res) => {
    try{
      if(!req.params.id){
        res.status(400).json({message: "Details not saved. Missing contact id"});
        return;
      }
      if(!req.body.firstName){
        res.status(400).json({message: "Details not saved. Missing first name"});
        return;
      }
      if(!req.body.lastName){
        res.status(400).json({message: "Details not saved. Missing last name"});
        return;
      }
      if(!req.body.preferredMethod){
        res.status(400).json({message: "Details not saved. Missing preferred contact method"});
        return;
      }
      const [year, month, day] = req.body.birthday ? req.body.birthday.split("-").map(Number) : [];

const safeDate = req.body.birthday ? new Date(Date.UTC(
  year,
  month - 1, // JS months are 0-based
  day,
  12, 0, 0   // noon UTC
)) : req.body.birthday;

      await Contact.findOneAndUpdate({user: req.user.id, _id: req.params.id}, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nickname: req.body.nickname,
        preferredDay: req.body.preferredDay,
        preferredMethod: req.body.preferredMethod,
        details:{
          phone: {
            mobile: req.body.mobilePhone,
            home: req.body.homePhone,
            work: req.body.workPhone,
          },
          email: {
            primary: req.body.primaryEmail,
            backup: req.body.backupEmail,
          },
          socials: req.body.socials,
          myersBriggsType: req.body.myersBriggsType,
          loveLanguages: req.body.loveLanguages,
          additionalNotes: req.body.additionalNotes,
        },
        tags: req.body.tags,
        birthday: safeDate
      })
      res.status(200).json({message: "Contact details saved!"});
    }catch(err){
      console.log(err);
      res.status(500).json({message: "Request failed"});
    }
  }
};