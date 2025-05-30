const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const createUser = require("../utils/createUser");
const genToken = require("../utils/generateToken")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isLoggedin = require("../middlewares/isLoggedin")

// render the signup page if the user is not logged in
router.get("/signup", (req, res) => {
  try {
    const token = req.cookies.token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          req.flash("error", err.message);
          return res.redirect("/");
        }
        if (decoded) {
          return res.redirect("/shop");
        }
      });
      // res.redirect("/shop")
    } else {
      res.render("signup");
    }
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("/");
  }
});

// registes new users to webapp
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      [name, email, password].some(
        (field) => !field || typeof field !== "string" || field.trim() === "",
      )
    ) {
      req.flash("error", "All fields are required");
      return res.redirect("/user/signup");
    }

    const existUser = await userModel.findOne({ email });

    if (!existUser) {
      createUser(name, email, password, req, res);
    } else {
      req.flash("error", "Account already exist");
      return res.redirect("/");
    }
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("/user/signup");
  }
});

// handle user login request
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (
    [email, password].some(
      (field) => !field || typeof field !== "string" || field.trim() === "",
    )
  ) {
    req.flash("error", "All fields are required");
    return res.redirect("/");
  }

  try {
    const user = await userModel.findOne({ email });

    if (user.banned) {
      req.flash("error", "Your account suspended");
      return res.redirect("/");
    }

    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          req.flash("error", err.message);
          return res.redirect("/");
        }
        if (result) {
          genToken(user, res);
          req.flash("success", "Login successfully");
          res.redirect("/shop");
        } else {
          req.flash("error", "Invalid credentials");
          return res.redirect("/");
        }
      });
    } else {
      req.flash("error", "Invalid credentials");
      return res.redirect("/");
    }
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("/");
  }
});

// handle user password changing functionality
router.post("/change-password", isLoggedin, async (req, res) => {
  
  try {
    const {currentPassword, newPassword, confirmPassword} = req.body
    
    if ([currentPassword, newPassword, confirmPassword].some((field)=> !field || typeof field !== "string" || field.trim() === "")) return res.send("All fields are required")

    if (currentPassword === newPassword) {
      return res.send("Current password and new password cannot be the same")
    }

    if (newPassword !== confirmPassword) {
      return res.send("New password and confirm password does not match")
    }

    const user = await userModel.findOne({_id: req.user._id})

    if (!user) {
      res.clearCookie("token")
      req.flash("error", "Internal server error")
      return res.redirect("/")
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) return res.send("Invalid current password")

    const hashedPassword = await bcrypt.hash(newPassword, 12)

    user.password = hashedPassword

    await user.save()

    res.clearCookie("token")

    req.flash("success", "Password updated")
    return res.redirect("/")
    
  } catch (error) {
    res.send(error.message)
  }
  
})

router.post("/update-address", isLoggedin, async (req, res)=> {
  try {
    const address = req.body
    if (Object.values(address).some((field)=> !field || field.trim() === "")){
      return res.send("All fields are required")
    }

    const user = await userModel.findOne({_id: req.user._id}).select("-password")

    if (!user) {
      res.clearCookie("token")
      req.flash("error", "Please login again")
      return res.redirect("/")
    }

    user.address = {
      addressLine1: address.add1,
      addressLine2: address.add2,
      city: address.city,
      pin: address.pincode,
      state: address.state
    }
    
    await user.save()
    
    res.send(user)
    
  } catch (error) {
    res.send(error.message)
  }
})
            
// toggles user suspension status
router.get("/toggle-status/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/owner/manage-users");
    }
    user.banned = !user.banned;
    await user.save();
    req.flash("success", "User status updated");
    return res.redirect("/owner/manage-users");
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("/owner/manage-users");
  }
});

module.exports = router;
