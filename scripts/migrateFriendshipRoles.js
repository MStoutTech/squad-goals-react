require("dotenv").config({ path: "./server/config/.env" });
const User = require("../server/models/User");

const mongoose = require("mongoose");

const connectDB = require("../server/config/database");
connectDB();

//replace current User.friendship roles with camelCase keys
async function migrate(){

const users = await User.find({})
async function changeData(user){
    
      await User.findByIdAndUpdate(
              user._id,
              { friendshipRoles: {nonJudgementalBestie: 
                        null
                    ,
                  brutallyHonestFriend: 
                        null
                    ,
                  careerMentor: 
                        null
                    ,
                  tirelessCheerleader: 
                        null
                    ,
                  inCaseOfEmergency: 
                        null
                    ,
                  healthcareProfessional: 
                        null
                ,
                  stylist:
                        null
                    } },
            );
            console.log(`updated user ${user._id}`)
}

await Promise.all(users.map(user=>changeData(user)))
console.log("finished updating")
const disconnectDB = async () => {
  try {
    const conn = await mongoose.disconnect();
    console.log(`MongoDB Disconnected:`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
disconnectDB();
}
migrate();


