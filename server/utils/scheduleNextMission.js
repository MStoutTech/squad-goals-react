const Contact = require("../models/Contact");
const Mission = require("../models/Mission");
const { updateUpcomingMission } =require("./updateUpcomingMission") ;

module.exports = {
    scheduleNextMission: async(userId, contactId) => {
        const now = new Date();
        const contact = await Contact.findById(contactId)

let daysStart
let daysEnd

switch(contact.contactFrequency){
	case "weekly":{
		const startOfNextWeek = new Date(now);
		startOfNextWeek.setDate(now.getDate() - now.getDay() + 7);
		startOfNextWeek.setHours(0,0,0,0);

		const endOfNextWeek = new Date(startOfNextWeek);
		endOfNextWeek.setDate(startOfNextWeek.getDate()+6);
		endOfNextWeek.setHours(23,59,59,999);
		
		daysStart=startOfNextWeek;
		daysEnd=endOfNextWeek;
		break;
	}
	case "monthly":{
		const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
		startOfNextMonth.setHours(0,0,0,0);

		const endOfNextMonth = new Date(startOfNextMonth.getFullYear(), startOfNextMonth.getMonth()+1, 0)
		endOfNextMonth.setHours(23,59,59,999);

		daysStart=startOfNextMonth; 
		daysEnd=endOfNextMonth; 
		break;
	}
	case "quarterly":{
		const startOfNextQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 1)
		startOfNextQuarter.setHours(0,0,0,0);

		const endOfNextQuarter = new Date(startOfNextQuarter.getFullYear(), startOfNextQuarter.getMonth()+3, 0)
		endOfNextQuarter.setHours(23,59,59,999);

		daysStart=startOfNextQuarter; 
		daysEnd=endOfNextQuarter; 
		break;
	}
}



const countDays = {}

const current = new Date(daysStart);
while (current <= daysEnd) {
  countDays[current.toLocaleDateString()] = 0;
  current.setDate(current.getDate() + 1);
}

const constraints ={$gte: daysStart, $lte: daysEnd}

const scheduledMissions = await Mission.find({
	user: userId,
	missionStatus:"new",
	scheduledFor:constraints
})

scheduledMissions.forEach(mission => (
	countDays[mission.scheduledFor.toLocaleDateString()] += 1
))

let leastMissions = Infinity;
let mostAvailableDay = new Date(now);

for (const day in countDays){
	if (countDays[day] < leastMissions){
		leastMissions = countDays[day];
		mostAvailableDay = new Date(day);
	};

};

//then schedule new contact mission for the mostAvailableDay

const newMission = await Mission.create({
        user: userId,
        contact: contactId,
        scheduledFor: mostAvailableDay,
        missionType: "contact",
        contactMethod: contact.preferredMethod,
        missionStatus: "new",
      });

      await updateUpcomingMission(contact, newMission);
    },
    
}