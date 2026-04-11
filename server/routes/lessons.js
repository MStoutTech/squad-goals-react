const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/lessons");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Comment Routes - simplified for now

//router.post("/createComment/:post", ensureAuth, lessonController.createComment);

//router.put("/likeComment/:id", ensureAuth, lessonController.likeComment);

//router.delete("/deleteComment/:id", ensureAuth, lessonController.deleteComment);

module.exports = router;