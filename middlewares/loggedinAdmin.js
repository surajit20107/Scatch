const jwt = require("jsonwebtoken")

const loggedinAdmin =(req, res, next)=>{
  const token = req.cookies.admin
  if(!token){
    res.redirect("/owner/admin")
  } else {
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    req.owner = decode
    next()
  }
}

module.exports = loggedinAdmin