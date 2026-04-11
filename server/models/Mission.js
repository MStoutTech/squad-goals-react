const mongoose = require("mongoose");

const MissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contact",
    },
    scheduledFor: {
        type: Date,
        required: true,
    },
    completedAt: {
        type: Date,
    },
    missionType: {
        type: String,
        required: true,
    },
    contactMethod: {
        type: String,
    },
    missionStatus: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Mission", MissionSchema);