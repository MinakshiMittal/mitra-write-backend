const mongoose = require("mongoose");

const NotesListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  notes:[{
    note:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note"
    }  }]
});

const NotesList = mongoose.model("Notes_List", NotesListSchema)

module.exports = { NotesList };