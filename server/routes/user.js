const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.post("/addTag", ensureAuth, userController.addTag)


module.exports = router;