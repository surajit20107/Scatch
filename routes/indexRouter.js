const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const isLoggedin = require("../middlewares/isLoggedin");
const uploadToCloudinary = require("../config/cloudinary");
const cloudinary = require("cloudinary").v2;

// render the user login page
router.get("/", (req, res) => {
  const token = req.cookies.token;
  if (token) {
    res.redirect("/shop");
  } else {
    res.render("index");
  }
});

// render shop if user logged in
router.get("/shop", isLoggedin, async (req, res) => {
  const user = req.user;
  const products = await productModel.find();
  res.render("products", { user, products });
});

// render the cart page
router.get("/cart", isLoggedin, async (req, res) => {
  const user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");
  res.render("cart", { user });
});

// remove products from user cart
router.get("/cart/remove/:productId", isLoggedin, async (req, res) => {
  const product = req.params.productId;

  const user = await userModel.findOne({ email: req.user.email });

  const productIndex = user.cart.indexOf(product);

  if (productIndex !== -1) {
    user.cart.splice(productIndex, 1);
    await user.save();
    res.redirect("/cart");
  } else {
    res.send("Product not found in cart");
  }
});

router.get("/profile", isLoggedin, async (req, res) => {
  const user = await userModel.findOne({ email: req.user.email }).select("-password");
  res.render("userProfile", { user});
});

router.post("/upload-avatar", isLoggedin, async (req, res) => {
  try {
    const file = req.files?.avatar;

    if (!file) {
      return res.send("No file selected");
    }

    if (file.size > 3 * 1024 * 1024) {
      return res.send("File size too large");
    }

    const base64String = `data:${file.mimetype};base64,${file.data.toString("base64")}`;
    const result = await uploadToCloudinary(base64String);
    if (!result) {
      return res.send("Failed to upload image");
    }
    const user = await userModel.findOne({ email: req.user.email });
    if (user.avatarId) {
      cloudinary.uploader.destroy(user.avatarId);
    }
    user.image = result.secure_url;
    user.avatarId = result.public_id;
    await user.save();
  } catch (error) {
    res.send(error);
  }
});

// user logout handler route
router.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.cookie("id", "");
  res.redirect("/");
});

module.exports = router;
