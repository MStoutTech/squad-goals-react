const Contact = require("../models/Contact");
const HistoryNote = require("../models/HistoryNote");
const { scheduleNextMission } = require("../utils/scheduleNextMission");

module.exports = {
  getSquad: async (req, res) => {
    try {
      const contacts = await Contact.find({ user: req.user.id }).populate("nextMission").lean();
      const heartCoreList = contacts.filter(contact => contact.connectionInstinct === "heartCore");
      const rayLiablesList = contacts.filter(contact => contact.connectionInstinct === "rayLiables");
      const buddiesList = contacts.filter(contact => contact.connectionInstinct === "buddies");
      
      res.status(200).json({heartCoreList: heartCoreList, rayLiablesList: rayLiablesList, buddiesList: buddiesList})
    } catch (err) {
      console.log(err);
    }
    
  },
  createContact: async (req, res) => {
    try{
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
      console.log("Contact added!");
      res.status(201).json({message: "Contact added!"});
    } catch (err) {
      console.log(err);
    }
  },
  getHistory: async (req, res) => {
    try {
      const contactHistory = await HistoryNote.find({ user: req.user.id, contact: req.params.id }).sort({ createdAt: -1 }).lean();

      
      res.status(200).json(contactHistory)
    } catch (err) {
      console.log(err);
    }
  }
};