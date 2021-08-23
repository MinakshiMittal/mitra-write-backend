const mongoose = require("mongoose");

const ArchivedNotesListSchema = new mongoose.Schema({
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

const ArchivedNotesList = mongoose.model("Archived_Notes_List", ArchivedNotesListSchema)

module.exports = { ArchivedNotesList };