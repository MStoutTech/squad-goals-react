const Contact = require("../models/Contact");

module.exports = {
    calculateContactScores: async (userId) => {
        //Map out scores for initial instinct

        const instinctMap = {
        heartCore: 100,
        rayLiables: 50,
        buddies: 25
        }
        //TODO: map score multipliers for evaluation priorities from user
        
        //Get all of the users contacts
        const contacts = await Contact.find({ user: userId }).lean();

        //Calculate score, initial instinct + score for role TODO: + evaluation scores, bulkwrite?
        //Store score in contact
        for(const contact of contacts){
            let evalTotal= 0
            if (contact.evaluation){
                contact.evaluation.forEach(question=>
                    {if(question.questionScore){ evalTotal += question.questionScore}}
                )
            }
            const newScore= instinctMap[contact.connectionInstinct] + (contact.friendshipRole ? 50 : 0) + evalTotal
            await Contact.findByIdAndUpdate(contact._id, {evalScore: newScore})
        }
        console.log("scores calculated")

    }
}