const mongoose = require("mongoose");

const HistoryNoteSchema = new mongoose.Schema({
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contact",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    missionType: {
        type: String,
        required: true,
    },
    noteText: {
        type: String,
        required: true,
    },
    mission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mission",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});

module.exports = mongoose.model("HistoryNote", HistoryNoteSchema);