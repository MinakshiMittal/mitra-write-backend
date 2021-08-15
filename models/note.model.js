const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: white
  },
  isPinned: Boolean,
  labels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Label"
  }]
});

const Note = mongoose.model("Note", NoteSchema);

module.exports = { Note };