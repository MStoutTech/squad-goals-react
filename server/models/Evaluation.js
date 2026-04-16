const mongoose = require("mongoose");

const EvaluationSchema = new mongoose.Schema({
    question:{type: String, required: true},
    options:[{label:{type: String},text:{type:String}, baseScore:{type: Number}}],
    topic:[{type:String}],
    isActive: {type: Boolean},

});

module.exports = mongoose.model("Evaluation", EvaluationSchema);