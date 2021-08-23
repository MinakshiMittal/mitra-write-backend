const mongoose = require("mongoose");

const LabelsListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  labels: [{
    label: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Label"
    }
  }]
});

const LabelsList = mongoose.model("Labels_List", LabelsListSchema);

module.exports = { LabelsList };