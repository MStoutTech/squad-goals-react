const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    firstName: { 
        type: String, 
        required: true,
    },
    lastName: {
        type: String, 
        required: true,
    },
    nickname: {
        type: String,
    },
    birthday: {
        type: Date,
    },
    image: {
        type: String,
    },
    cloudinaryId: {
        type: String,
    },
    details: {
        phone: {
            mobile: { type: String },
            home: { type: String },
            work: { type: String }
        },
        email: {
            primary: { type: String },
            backup: { type: String }
        },
        socials: [{
            platform: {type: String},
            handle: {type: String},
        }],
        myersBriggsType: {type: String},
        loveLanguages: [{type: String}],
        additionalNotes: {type: String}
    },
    preferredMethod:{
        type: String,
        required: true, 
    },
    connectionInstinct: {
        type: String,
        required: true,
    },
    evalScore: {
        type: Number,
        required: true,
    },
    friendList: {
        type: String,
    },
    lastContact: {
        type: Date,
    },
    nextMission:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mission",
    },
    contactFrequency: {
        type: String,
        required: true,
    },
    tags: [{
        type: String,
    }],
    preferredDay: [{type: String},],
    evaluation: [{
        questionId: {type: mongoose.Schema.Types.ObjectId, ref: "Evaluation"},
        questionOption: [{type: String}],
        questionScore: {type: Number},
    }],
    evalComplete: {type: Boolean},
    evalCompleteDate: {type: Date},
    friendshipRole: {type: String, enum:["nonJudgementalBestie", "brutallyHonestFriend", "careerMentor", "tirelessCheerleader", "inCaseOfEmergency", "healthcareProfessional", "stylist", null], default: null},
});

module.exports = mongoose.model("Contact", ContactSchema);