const express = require("express");
const router = express.Router();
const productModel = require("../models/productModel")
const upload = require("../config/multerConfig")
const isLoggedin = require("../middlewares/isLoggedin")

// creates new products (admin)
router.post("/product/create", upload.single("productImage"), async (req, res) => {
  const {name, description, price, stock, mrp, brand, category} = req.body
  try {
    const product = await productModel.create({
      name,
      description,
      price,
      stock,
      mrp,
      brand,
      category,
      image: req.file.buffer,
    })
    res.redirect("/owner/dashboard")
  } catch (error) {
    res.send(error.message)
  }
})

// add products to user cart
router.get("/product/:productId", isLoggedin, async (req, res) => {
  const user = req.user
  const product = await productModel.findOne({_id: req.params.productId})
  const productIndex = user.cart.indexOf(product._id)

  if (productIndex !== -1) {
    res.send("Product already in your cart")
  } else {
    user.cart.push(product)
    await user.save()
    res.redirect("/shop")
  }

  //user.cart.push(product)
  //await user.save()
  //res.redirect("/shop")

})

// edit products of shop page
router.post("/update/:id", async (req, res) => {
  try {
    const {name, description, mrp, price, brand} = req.body
    const product = await productModel.findOneAndUpdate({_id: req.params.id}, {name, description, mrp, price, brand}, {new: true})
    res.redirect("/owner/dashboard")
  } catch (error) {
    res.send(error.message)
  }
})

module.exports = router;