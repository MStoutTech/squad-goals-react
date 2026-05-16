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
      const answerCount = {}
      evaluation.forEach(question => {
        contacts.forEach(contact => {
          if (contact.evaluation?.find(q=> q.questionId.toString() == question._id.toString())?.questionOption?.length > 0){
            answerCount[question._id.toString()] ? answerCount[question._id.toString()] +=1 : answerCount[question._id.toString()] =1
          }
        })
      })

      const sortedEval = evaluation.slice().sort((a,b)=> (answerCount[a._id.toString()] || 0) - (answerCount[b._id.toString()] || 0))

      res.status(200).json({evaluation: sortedEval, contacts: contacts})
    }catch (err){
      console.log(err);
      res.status(500).json({message: `Error: ${err}`});
    }
  },
  saveAnswers: async(req, res) => {
    try{
      const nonEmptyAnswers = req.body.answers.filter(contact => contact.question.questionOption != null && contact.question.questionOption.length > 0)
      const updatedContacts = await Promise.all(nonEmptyAnswers.map( async(contact) => {
        const found = await Contact.findById(contact.id)
        const questionIndex = found.evaluation.findIndex(entry => entry.questionId == contact.question.questionId)
        if (questionIndex !== -1) {
          found.evaluation[questionIndex] = contact.question;
        } else {
          found.evaluation.push(contact.question);
        }
        await found.save()
        return found
      }))

      await calculateContactScores(req.user.id);
      await sortSquad(req.user.id);

      
      res.status(200).json({message: "Answers Saved!", updatedContacts: updatedContacts});
    }catch (err){
      console.log(err);
      res.status(500).json({message: `Error: ${err}`});
    }
  },
  saveSingleContactAnswers: async(req,res)=>{
    try{
      const updatedContacts = await Contact.findById(req.params.id);
      updatedContacts.evaluation = req.body.answers.filter(question => question.questionOption != null && question.questionOption.length > 0);
      await updatedContacts.save();

    await calculateContactScores(req.user.id);
    await sortSquad(req.user.id);
      res.status(200).json({message: "Answers Saved!", updatedContacts: [updatedContacts]});
    }catch (err){
      console.log(err);
      res.status(500).json({message: `Error: ${err}`});
    }
  }
}