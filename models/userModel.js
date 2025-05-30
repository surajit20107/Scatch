const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    min: [10, "Phone number must be 10 digits"],
    max: [10, "Phone number must be 10 digits"]
  },
  address: {
    addressLine1: {
      type: String,
      default: "",
    },
    addressLine2: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    pin: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
  },
  banned: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    default: "https://res.cloudinary.com/dwlfhknvs/image/upload/v1746986216/Profile_avatar_placeholder_large_atf6sj.png",
  },
  avatarId: {
    type: String
  },
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
}, {timestamps: true});

module.exports = mongoose.model("user", userSchema);
