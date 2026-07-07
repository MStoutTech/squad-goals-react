const express = require("express");
const router = express.Router();
const evaluationController = require("../controllers/evaluation");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Evaluation Routes - simplified for now

//router.post("/addQuestion", ensureAuth, evaluationController.addQuestion);
//Disabled after initial DB seeding, re-enable behind an admin-only gate for production
router.get("/getEvaluation", ensureAuth, evaluationController.getEvaluation);
router.put("/saveAnswers", ensureAuth, evaluationController.saveAnswers);
router.put("/:id/saveAnswers", ensureAuth, evaluationController.saveSingleContactAnswers);

module.exports = router;