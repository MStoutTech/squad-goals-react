const Contact = require("../models/Contact");
const Mission = require("../models/Mission");
const { updateUpcomingMission } =require("./updateUpcomingMission") ;

module.exports = {
    scheduleNextMission: async(userId, contactId) => {
        const now = new Date();
        const contact = await Contact.findById(contactId)

		const mostAvailableDay = await module.exports.findOptimalMissionDay(now, contact, userId)


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

	findOptimalMissionDay: async(prevMission, contact, userID)=>{
		const today = new Date();
		let anchorDate = prevMission;
		let daysStart;
		let daysEnd;

		switch(contact.contactFrequency){
			case "weekly":{
				//assure an anchor date
				if(!anchorDate){
            		anchorDate = new Date()
            		anchorDate.setDate(today.getDate() - today.getDay()-7)
          		}
				//compute a raw window
				let startOfNextWeek = new Date(anchorDate);
				startOfNextWeek.setDate(anchorDate.getDate() - anchorDate.getDay() + 7);
		      	startOfNextWeek.setHours(0,0,0,0);

				let endOfNextWeek = new Date(startOfNextWeek);
		      	endOfNextWeek.setDate(startOfNextWeek.getDate()+6);
		      	endOfNextWeek.setHours(23,59,59,999);

				//check where today falls relative to window
				//adjust daysstart and daysend accordingly:
				if(endOfNextWeek < today){
					//- If the window has fully passed relative to today, roll the whole window forward by one period
            		const newStart = new Date(startOfNextWeek);
            		newStart.setDate(newStart.getDate() + 7);

            		const newEnd = new Date(endOfNextWeek);
            		newEnd.setDate(newEnd.getDate() + 7)
      
            		daysStart=newStart;
            		daysEnd=newEnd;
          		} else if (today >= startOfNextWeek){
					//- If today is already inside the window, the window stays the same, but start from tomorrow
            		const tomorrow = new Date(today);
            		tomorrow.setDate(today.getDate()+1);
            		tomorrow.setHours(0,0,0,0);	
      
            		daysStart=tomorrow;
		        	daysEnd=endOfNextWeek;
          		} else {
					//- Else, the window is fully in the future and you can use it as computed
           		 	daysStart=startOfNextWeek;
            		daysEnd=endOfNextWeek;
          		}
		      	break;
			}
			case "monthly":{
				//assure an anchor date
          		if(!anchorDate){
            	anchorDate = new Date(today.getFullYear(), today.getMonth()-1, today.getDay());
          		}

				//compute a raw window
		      	const startOfNextMonth = new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 1);
		      	startOfNextMonth.setHours(0,0,0,0);

		      	const endOfNextMonth = new Date(startOfNextMonth.getFullYear(), startOfNextMonth.getMonth()+1, 0)
		      	endOfNextMonth.setHours(23,59,59,999);

				//check where today falls relative to window
				//adjust daysstart and daysend accordingly:
		      	if(endOfNextMonth < today){
					//- If the window has fully passed relative to today, roll the whole window forward by one period
            		const newStart = new Date(startOfNextMonth.getFullYear(), startOfNextMonth.getMonth()+1, 1);

            		const newEnd = new Date(newStart.getFullYear(), newStart.getMonth()+1, 0)
		        	newEnd.setHours(23,59,59,999)
            		daysStart=newStart;
            		daysEnd=newEnd;
          		} else if (today >= startOfNextMonth){
					//- If today is already inside the window, the window stays the same, but start from tomorrow
      	    		const tomorrow = new Date(today);
            		tomorrow.setDate(today.getDate()+1);
            		tomorrow.setHours(0,0,0,0);	
      
            		daysStart=tomorrow;
		        	daysEnd=endOfNextMonth;
          		} else {
					//- Else, the window is fully in the future and you can use it as computed
            		daysStart=startOfNextMonth;
            		daysEnd=endOfNextMonth;
          		}
          		break;
	      	}
	      	case "quarterly":{
				//assure an anchor date
          		if(!anchorDate){
            		anchorDate = new Date(today.getFullYear(), today.getMonth()-3, today.getDay());
          		}

				//compute a raw window
		      	const startOfNextQuarter = new Date(anchorDate.getFullYear(), Math.floor(anchorDate.getMonth() / 3) * 3 + 3, 1)
		      	startOfNextQuarter.setHours(0,0,0,0);

		      	const endOfNextQuarter = new Date(startOfNextQuarter.getFullYear(), startOfNextQuarter.getMonth()+3, 0)
		      	endOfNextQuarter.setHours(23,59,59,999);

				//check where today falls relative to window
				//adjust daysstart and daysend accordingly:
          		if(endOfNextQuarter < today){
					//- If the window has fully passed relative to today, roll the whole window forward by one period
            		const newStart = new Date(startOfNextQuarter.getFullYear(), startOfNextQuarter.getMonth()+3, 1);


            		const newEnd = new Date(newStart.getFullYear(), newStart.getMonth()+3, 0)
		        	newEnd.setHours(23,59,59,999)
      
            		daysStart=newStart;
            		daysEnd=newEnd;
          		} else if (today >= startOfNextQuarter){
					//- If today is already inside the window, the window stays the same, but start from tomorrow
      	    		const tomorrow = new Date(today);
            		tomorrow.setDate(today.getDate()+1);
            		tomorrow.setHours(0,0,0,0);	
      
            		daysStart=tomorrow;
		        	daysEnd=endOfNextQuarter;
          		} else {
					//- Else, the window is fully in the future and you can use it as computed
            		daysStart=startOfNextQuarter;
            		daysEnd=endOfNextQuarter;
          		}

		      	break;
	      	}
        	default:
          		throw new Error("Invalid contact frequency");
		}
		
		if (!daysStart || !daysEnd || isNaN(daysStart) || isNaN(daysEnd)) {
        throw new Error("Invalid date range");
      	}
		
		let mostAvailableDay = new Date();

		const birthday = contact.birthday ? new Date(contact.birthday) : null

		//if this person's birthday happened in the same year as the start of our scheduling window, what date would that be?
		const startRangeBirthday = contact.birthday ? new Date(birthday): null
		startRangeBirthday?.setFullYear(daysStart.getFullYear())
		//if this person's birthday happened in the same year as the end of our scheduling window, what date would that be?
		const endRangeBirthday = contact.birthday ? new Date(birthday) : null
		endRangeBirthday?.setFullYear(daysEnd.getFullYear())


		//if the start range birthday is in the window, use that date, or if the end range birthday is in the window, use that date
		if(startRangeBirthday >= daysStart && startRangeBirthday <= daysEnd){ mostAvailableDay = startRangeBirthday}
		else if (endRangeBirthday >= daysStart && endRangeBirthday <= daysEnd){mostAvailableDay = endRangeBirthday}
		else{
			const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
			const countDays = {}
			let safetyCounter = 0;
			const MAX_DAYS = 93;
			const current = new Date(daysStart);
			

			//count preferred days in range
			while (current <= daysEnd && safetyCounter < MAX_DAYS) {
				if((contact.preferredDay?.length > 0 && contact.preferredDay.includes(days[current.getDay()])) || (!contact.preferredDay || contact.preferredDay?.length == 0)){
					countDays[current.toLocaleDateString()] = 0;
				}
  
  				current.setDate(current.getDate() + 1);
				safetyCounter++;
			}
			if (safetyCounter === MAX_DAYS) {
				throw new Error("Loop exceeded safe limit");
			}


			//if there are no preferred days in the range, redo the counter
			if (Object.keys(countDays).length === 0){
				safetyCounter = 0;
				current.setTime(daysStart.getTime());
				while (current <= daysEnd && safetyCounter < MAX_DAYS) {
					countDays[current.toLocaleDateString()] = 0;
		  
					current.setDate(current.getDate() + 1);
					safetyCounter++;
				}
				if (safetyCounter === MAX_DAYS) {
					throw new Error("Loop exceeded safe limit");
				}
			}
			const constraints ={$gte: daysStart, $lte: daysEnd}
		
			const scheduledMissions = await Mission.find({
				  user: userID,
				  missionStatus:"new",
				  scheduledFor:constraints
			})
		
			scheduledMissions.forEach(mission => {
				if (countDays[mission.scheduledFor.toLocaleDateString()] !== undefined){
				countDays[mission.scheduledFor.toLocaleDateString()] += 1
				}
			})
		
			let leastMissions = Infinity;
			  
		
			for (const day in countDays){
				if (countDays[day] < leastMissions){
					leastMissions = countDays[day];
					mostAvailableDay = new Date(day);
				};
		
			};
		}
		return mostAvailableDay;
		
	}
    
}