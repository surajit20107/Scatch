const express = require("express");
const router = express.Router();
const ownerModel = require("../models/ownerModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const loggedinAdmin = require("../middlewares/loggedinAdmin")

// render admin login page
router.get("/admin", (req, res)=>{
  res.render("adminPanel")
});

// render create admin page
router.get("/admin/register", (req, res)=>{
  res.render("registerOwner")
});

// create new admin
router.post("/admin/create", async (req, res)=>{
  const {name, email, password}= req.body
  try {
    const owner = await ownerModel.findOne({email})
    if (owner) {
      res.send("Account already exists")
    }else{
      bcrypt.genSalt(12, (error, salt)=>{
        bcrypt.hash(password, salt, async (error, hash)=>{
          if(error){
            return res.send(error.message)
          }
          const owner = await ownerModel.create({
            name,
            email,
            password: hash,
          })
          //const token = jwt.sign({email, id: owner._id}, process.env.JWT_SECRET)
      //res.cookie("token", token)
          res.redirect("/owner/admin")
        })
        
      })
        //res.redirect("/owner/dashboard")
    }
  } catch (error) {
    res.send(error.message)
  }
})

// login to admin panel
router.post("/admin/login", async (req, res)=>{
  const {email, password} = req.body
  try {
    const owner = await ownerModel.findOne({email})
    if (!owner) {
      res.send("accout does not exist")
    }else{
      bcrypt.compare(password, owner.password, (err, result)=>{
        if(result){
          const token = jwt.sign({email, id: owner._id}, process.env.JWT_SECRET)
          res.cookie("admin", token)
          res.redirect("/owner/dashboard")
        } else {
          res.send("Invalid credintials")
        }
      })
    }
  } catch (error) {
    res.send(error.message)
  }
})

// route to create new products
router.get("/product/create", loggedinAdmin, async (req, res)=>{
  res.render("createProduct")
})

// render the admin dashboard
router.get("/dashboard", loggedinAdmin, async (req, res)=>{
  const admin = await ownerModel.findOne({email: req.owner.email}).select("-password")
  const allProducts = await productModel.find()
  const allUsers = await userModel.find()
  res.render("adminProfile", {admin, allProducts, allUsers})
})

// manage all the users
router.get("/manage-users", loggedinAdmin, async (req, res)=>{
  const allUsers = await userModel.find()
  res.render("manageUsers", {allUsers})
})

// manage products of shop page
router.get("/product/manage", loggedinAdmin, async (req, res)=>{
  const allProducts = await productModel.find()
  res.render("manageProducts", {allProducts})
})

// edit products of shop page
router.get("/edit/:id", loggedinAdmin, async (req, res)=>{
  const product = await productModel.findOne({_id: req.params.id}).select("-image")
  res.render("editProduct", {product})
})

// delete products of shop page
router.get("/delete/:id", loggedinAdmin, async (req, res)=>{
  const allProducts = await productModel.findOneAndDelete({_id: req.params.id})
  res.redirect("/owner/product/manage")
})

// logout the admin
router.get("/logout", (req, res)=>{
  res.cookie("token", "")
  res.cookie("admin", "")
  res.redirect("/owner/admin")
})

module.exports = router;