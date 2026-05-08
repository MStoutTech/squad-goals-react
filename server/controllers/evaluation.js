const Evaluation = require("../models/Evaluation");
const Contact = require("../models/Contact");
const User = require("../models/User")
const { calculateContactScores } = require("../utils/calculateContactScores");
const { sortSquad } = require("../utils/sortSquad");


module.exports = {
  addQuestion: async (req, res) => {
    try {
        await Evaluation.create({...req.body})
        res.status(201).json({message: "Question added!"});
    }catch (err) {
      console.log(err);
      res.status(500).json({message: `Error: ${err}`});
    }
  },
  getEvaluation: async(req, res) => {
    try{
      const evaluation = await Evaluation.find({isActive: true}).lean()
      const contacts = await Contact.find({ user: req.user.id }).lean();
      res.status(200).json({evaluation: evaluation, contacts: contacts})
    }catch (err){
      console.log(err);
      res.status(500).json({message: `Error: ${err}`});
    }
  },
  saveAnswers: async(req, res) => {
    try{
      await Promise.all(req.body.answers.map( async(contact) => {
        const found = await Contact.findById(contact.id)
        const questionIndex = found.evaluation.findIndex(entry => entry.questionId == contact.question.questionId)
        if (questionIndex !== -1) {
          found.evaluation[questionIndex] = contact.question;
        } else {
          found.evaluation.push(contact.question);
        }
        await found.save()
      }))

      await calculateContactScores(req.user.id);
      await sortSquad(req.user.id);
      
      res.status(200).json({message: "Answers Saved!"});
    }catch (err){
      console.log(err);
      res.status(500).json({message: `Error: ${err}`});
    }
  }
}