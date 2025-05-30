const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")

const isLoggedin = async (req, res, next) => {
  const token = req.cookies.token
  
  if(!token) {
    return res.redirect("/")
  }
  
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    const data = await userModel.findOne({email: decode.email}).select("-password")
    req.user = data
    next()
  } catch (error) {
    req.flash("error", error.message)
    return res.redirect("/")
  }
}

module.exports = isLoggedin;