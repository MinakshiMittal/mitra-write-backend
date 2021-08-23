const mongoose = require("mongoose");

const LabelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  // notes: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Note"
  // }]

});

const Label = mongoose.model("Label", LabelSchema);

module.exports = { Label };