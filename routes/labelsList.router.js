const express = require("express");
const router = express.Router();
const {LabelsList} = require("../models/labelsList.model");
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
    const labelsList = LabelsList.findOne({userId});

    if(labelsList) {
      const populatedLabelsList = await labelsList.populate("labels.label");

      return res.json({success: true, labelsList: populatedLabelsList});
    }
    res.json({success: false, message: "No labels list for this user."});

  } catch (error) {
    res.status(500).json({success: false, errorMessage: error.message});
  }
})
// .post(async(req, res) => {
//   try {
//     const {userId} = req.user;
//     const note = req.body;

//     const notesList = await NotesList.findOne({userId});

//     if(notesList) {
//       // const noteAlreadyInNotesList = _.some(wishlist.itemsInWishlist, (productItem) => productItem.product.toString() === product.product._id);

//       // if(productAlreadyInWishlist) {
//       //   return res.status(409).json({success: false, message: "Product is already present"});
//       // }

//       notesList.notes.addToSet(note);
//       await notesList.save();

//       res.json({success: true, notesList});
//     }
//     else {
//       const notesList = new NotesList({
//         userId,
//         notes: [note]
//       });
//       await notesList.save();

//       res.json({success: true, notesList})
//     }
//   } catch (error) {
//     res.status(500).json({success: false, errorMessage: error.message});
//   }
// });

router.delete("/:labelId", async(req, res) => {
  try {
    const { userId } = req.user;
    const { labelId } = req.params;
    let labelsList = await LabelsList.findOne({ userId });

    labelsList = _.extend(labelsList, {
      labels: _.filter(labelsList.labels, (existingLabel) => 
        existingLabel.label.toString() !== labelId
      ),
    });
    await labelsList.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: error.message });
  }
});

module.exports = router;