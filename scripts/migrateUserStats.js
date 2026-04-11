require("dotenv").config({ path: "./server/config/.env" });
const Mission = require("../server/models/Mission");
const User = require("../server/models/User");

const mongoose = require("mongoose");

const connectDB = require("../server/config/database");
connectDB();

//add the property status:{totalCompleted, streak, longestStreak, lastCompletedDate} to user
//calculate and store in user model 
async function migrate(){

const users = await User.find({})
async function changeData(user){
    const totalCompleted = await Mission.countDocuments({
  user: user._id,
  missionStatus: "complete",
})

const lastCompleted = await Mission.find({
        user: user._id,
        missionStatus: "complete",
      })
      .limit(1)
      .sort({ completedAt: -1 })
      .lean();

      await User.findByIdAndUpdate(
              user._id,
              { stats: {totalCompleted: totalCompleted, streak: 0, longestStreak: 0, lastCompletedDate: lastCompleted[0].completedAt || null} },
            );
            console.log(`updated user ${user._id}`)
}

await Promise.all(users.map(user=>changeData(user)))
console.log("finished updating")
disconnectDB();
}
migrate();

const disconnectDB = async () => {
  try {
    const conn = await mongoose.disconnect();
    console.log(`MongoDB Disconnected:`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

