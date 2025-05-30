const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type:Number,
    required: true
  },
  image: {
    type: Buffer,
    required: true
  },
  category: {
    type:String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  mrp: {
    type: Number,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
}, {timestamps: true})

module.exports = mongoose.model("product", productSchema)