const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogs");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Comment Routes - simplified for now

//router.post("/createComment/:post", ensureAuth, blogController.createComment);

//router.put("/likeComment/:id", ensureAuth, blogController.likeComment);

//router.delete("/deleteComment/:id", ensureAuth, blogController.deleteComment);

module.exports = router;