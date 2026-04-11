const Contact = require("../models/Contact");
const Mission = require("../models/Mission");
module.exports = {
    updateUpcomingMission: async(contact, newMission) => {
        
        
        if (contact.nextMission){
            const missionCleanup = await Mission.findById(contact.nextMission)
            if (missionCleanup.missionStatus=== "new"){
                await Mission.deleteOne({_id: contact.nextMission})
            console.log("Deleted old mission")
            }
            
        }

        await Contact.findByIdAndUpdate(contact._id, {nextMission: newMission._id}, {new: true})
    },
}