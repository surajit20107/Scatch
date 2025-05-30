const jwt = require("jsonwebtoken");

const generateToken = (user, res) => {
  const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token);
  res.cookie("id", user._id)
};

module.exports = generateToken;
