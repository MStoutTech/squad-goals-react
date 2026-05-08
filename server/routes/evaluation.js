const express = require("express");
const router = express.Router();
const evaluationController = require("../controllers/evaluation");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Evaluation Routes - simplified for now

router.post("/addQuestion", ensureAuth, evaluationController.addQuestion);
router.get("/getEvaluation", ensureAuth, evaluationController.getEvaluation);
router.put("/saveAnswers", ensureAuth, evaluationController.saveAnswers);


module.exports = router;