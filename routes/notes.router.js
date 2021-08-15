const express = require("express");
const router = express.Router();
const {Note} = require("../models/note.model");
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
  .get(async (req, res) => {
    try {
      const products = await Product.find({});
      res.json({ products, success: true });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Unable to get products",
        errorMessage: error.message
      });
    }
  })
  .post(async (req, res) => {
    try {
      let product = req.body;
      const category = product.category;
      const categoryFound = await Category.findOne({ name: category });

      if (categoryFound) {
        const NewProduct = new Product(product);
        await NewProduct.save();
        
        res.json({ success: true, product });
      } else {
        res.json({ success: false, message: "Product Category not available" });
      }
    } catch (error) {
      res.status(500).json({
        success: true,
        message: "Unable to save new product",
        errorMessage: error.message
      });
    }
  });

router.param("productId", async (req, res, next, productId) => {
  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "error finding product" });
    }
    req.product = product;
    next();
  } catch {
    res
      .status(500)
      .json({ success: false, messgae: "error while retrieving the product" });
  }
});

router.get("/:productId", async (req, res) => {
  const { product } = req;
  res.json({ success: true, product });
});

module.exports = router;
