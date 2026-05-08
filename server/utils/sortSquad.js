const Contact = require("../models/Contact");

module.exports = {
    sortSquad: async (userId) => {
        try{
            const contacts = await Contact.find({ user: userId }).lean();
            const sortedContacts = contacts.slice().sort((a,b) => b.evalScore - a.evalScore)
        let heartCoreCount = 0
        let rayLiablesCount = 0

        await Promise.all(sortedContacts.map(async(contact) => {
            if(heartCoreCount < 15 && contact.evalScore >= 100){
                await Contact.findByIdAndUpdate(contact._id, {friendList: "heartCore"});
                heartCoreCount ++;
            } else if (rayLiablesCount < 35 && contact.evalScore >= 50){
                await Contact.findByIdAndUpdate(contact._id, {friendList: "rayLiables"});
                rayLiablesCount ++;
            } else {
                await Contact.findByIdAndUpdate(contact._id, {friendList: "buddies"})
            }
        }))
        console.log("sortedLists")
        }catch(err){
            console.log(err);
      res.status(500).json({message: `Error: ${err}`});
        }
        

    }
}