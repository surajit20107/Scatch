const mongoose = require("mongoose");

const ownerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: "default.png"
  },
  products: {
    type: Array,
    default: []
  }
}, {timestamps: true})

module.exports = mongoose.model("owner", ownerSchema);