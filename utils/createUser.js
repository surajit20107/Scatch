const bcrypt = require("bcrypt");
const genToken = require("../utils/generateToken")
const userModel = require("../models/userModel");

const createUser = (name, email, password, req, res) => {
  bcrypt.genSalt(12, (error, result) => {
    bcrypt.hash(password, result, async (err, hash) => {
      if (err) {
        req.flash("error", "Internal server error")
        res.redirect("/user/signup")
      } else {
        const user = await userModel.create({
          name,
          email,
          password: hash,
        });
        // generate token
        genToken(user, res);
        req.flash("success", "Account created")
        res.redirect("/shop");
      }
    });
  });
};
module.exports = createUser;
