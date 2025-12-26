const express = require("express");
const { listNotes, createNote } = require("../controller/notes");
const router = express.Router();

router.get("/", listNotes);
router.post("/", createNote);

module.exports = router;
