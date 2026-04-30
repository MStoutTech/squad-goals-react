const mongoose = require("mongoose");

const EvaluationSchema = new mongoose.Schema({
    question:{type: String, required: true},
    questionType: {
        type: String,
        enum: ["scored", "categorical"],
        required: true,
    },
    displayType: {
        type: String,
        enum: ["radio", "checkbox", "slider"],
        required: true
    },
    topic:[{type:String}],
    isActive: {type: Boolean, default: true},
    options:[{text:{type:String, required: true}, baseScore:{type: Number}}],
    sliderConfig:{
        min: {type: Number},
        max: {type: Number},
        step: {type: Number},
        minLabel: {type: String},
        maxLabel: {type: String},
        scoreMap: [{
            value: {type: Number},
            baseScore: {type: Number}
        }]
    }

});

module.exports = mongoose.model("Evaluation", EvaluationSchema);