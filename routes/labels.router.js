const express = require("express");
const router = express.Router();
const {Label} = require("../models/label.model");
const {LabelsList} = require("../models/labelsList.model")
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

router
  .route("/")
  // .get(async (req, res) => {
  //   try {
  //     const notes = await NotesList.find({userId});
  //     res.json({ products, success: true });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: "Unable to get products",
  //       errorMessage: error.message
  //     });
  //   }
  // })
  .post(async (req, res) => {
    try {
      let label = req.body;
      
        const NewLabel = new Label(label);
        await NewLabel.save();

        const labelsList = await LabelsList.findOne({userId});

        if(labelsList) {
         labelsList.labels.addToSet(label);
      await labelsList.save();

      res.json({success: true, labelsList});
    }
    else {
      const labelsList = new LabelsList({
        userId,
        labels: [label]
      });
      await labelsList.save();

      res.json({success: true, labelsList})
    }
        
        res.json({ success: true, label });
      
    } catch (error) {
      res.status(500).json({
        success: true,
        message: "Unable to save new product",
        errorMessage: error.message
      });
    }
  });

module.exports = router;
