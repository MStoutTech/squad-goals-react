//Use .env file in config folder
require("dotenv").config({ path: "./server/config/.env" });

const express = require("express");
const app = express();
const cors = require("cors");

//allow both development servers to communicate with each other
app.use(cors({
  origin: "http://localhost:5173",
  credentials:true
}))

const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const blogRoutes = require("./routes/blogs");
const missionRoutes = require("./routes/missions");
const contactRoutes = require("./routes/contacts");
const lessonRoutes = require("./routes/lessons");
const userRoutes = require("./routes/user");
const evalRoutes = require("./routes/evaluation");



// Passport config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use("/api", mainRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/mission", missionRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/lesson", lessonRoutes);
app.use("/api/user", userRoutes);
app.use("/api/evaluation", evalRoutes);


//Server Running
app.listen(process.env.PORT, () => {
  console.log("Server is running you did it!");
});
