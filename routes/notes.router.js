const express = require("express");
const router = express.Router();
const {Note} = require("../models/note.model");
const {NotesList} = require("../models/notesList.model");
const {ArchivedNotesList} = require("../models/archivedNotesList.model");
const {_, extend} = require("lodash");
const jwt = require("jsonwebtoken");

router.use(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, errorMessage: "Unauthorized access" });
  }
});

router.route("/")
.get(async (req, res) => {
  try {
    const {userId} = req.user;
    const notesList = await NotesList.findOne({userId});

    if(notesList) {
      const populatedNotesList = await notesList.populate("notes.note");

      console.log(populatedNotesList)

      return res.json({success: true, notesList: populatedNotesList});
    }
    res.json({success: false, message: "No notes list for this user."});

  } catch (error) {
    res.status(500).json({success: false, errorMessage: error.message});
  }
})
.post(async(req, res) => {
  try {
    const {userId} = req.user;
    console.log(userId)
    const note = req.body;

    console.log(note)

    const NewNote = new Note(note);
    await NewNote.save();

    console.log(NewNote)

    const notesList = await NotesList.findOne({userId});

    console.log(notesList);

    if(notesList) {

      notesList.notes.push({note: NewNote});
      await notesList.save();

      console.log(notesList);

      res.json({success: true, notesList});
    }
    else {
      const NewNotesList = new NotesList({
        userId,
        notes: [{note: NewNote}]
      });
      await NewNotesList.save();

      res.json({success: true, notesList: NewNotesList})
    }
  } catch (error) {
    res.status(500).json({success: false, errorMessage: error.message});
  }
});

router.delete("/:noteId", async(req, res) => {
  try {
    const { userId } = req.user;
    const { noteId } = req.params;

    const note = await Note.findById(noteId);
    
    
    let notesList = await NotesList.findOne({ userId });

    notesList = _.extend(notesList, {
      notes: _.filter(notesList.notes, (note) => 
        note.note.toString() !== noteId
      ),
    });
    await notesList.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: error.message });
  }
});

router.route("/:noteId").post(async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const note = await Note.findById(noteId);

    const updateInNote = req.body;
    const updatedNote = extend(note, updateInNote);
    
    await updatedNote.save();

    res.status(200).json({ success: true, note: updatedNote });
  } 
  catch(error){
  res.status(500).json({ success: false, errorMessage: error.message });
  }
});

router.route("/archived-notes").get( async(req, res) => {
  try {
    const {userId} = req.user;
    const archivedNotesList = ArchivedNotesList.findOne({userId});

    if(archivedNotesList) {
      const populatedArchivedNotesList = await archivedNotesList.populate("notes.note");

      return res.json({success: true, archivedNotesList: populatedArchivedNotesList});
    }
    res.json({success: false, message: "No archived notes for this user."});

  } catch (error) {
    res.status(500).json({success: false, errorMessage: error.message});
  }
})
.post(async(req, res) => {
  try {
    const {userId} = req.user;
    const note = req.body;

    const archivedNotesList = await ArchivedNotesList.findOne({userId});

    if(archivedNotesList) {
      achivedNotesList.notes.push({note});
      await archivedNotesList.save();

      res.json({success: true, archivedNotesList});
    }
    else {
      const archivedNotesList = new ArchivedNotesList({
        userId,
        notes: [{note}]
      });
      await archivedNotesList.save();

      res.json({success: true, archivedNotesList})
    }
  } catch (error) {
    res.status(500).json({success: false, errorMessage: error.message});
  }
});
module.exports = router;
