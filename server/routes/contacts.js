const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contacts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Contact Routes - simplified for now

router.post("/createContact", ensureAuth, contactController.createContact);
router.get("/getSquad", ensureAuth, contactController.getSquad);
router.get("/:id/history", ensureAuth, contactController.getHistory);


module.exports = router;