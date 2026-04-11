const express = require("express");
const router = express.Router();
const missionController = require("../controllers/missions");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Mission Routes - simplified for now

router.post("/createMission", ensureAuth, missionController.createMission);
router.get("/:id/details", ensureAuth, missionController.getMissionDetails);
router.get("/searchContacts", ensureAuth, missionController.searchContacts);
router.put("/:id/complete", ensureAuth, missionController.completeMission);
router.put("/:id/snooze", ensureAuth, missionController.snoozeMission);
router.get("/missionList", ensureAuth, missionController.getMissionList);

module.exports = router;