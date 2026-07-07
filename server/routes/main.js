const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);

router.post("/signup", ensureGuest, authController.postSignup);
router.get("/user",  authController.getUser)


module.exports = router;
