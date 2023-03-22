const express = require("express");
const notesController = require("../controllers/notes-controller");

const router = express.Router();

router.post("/add", notesController.addNotes);
router.get("/get_user_notes", notesController.getUserNotes);

module.exports = router;
