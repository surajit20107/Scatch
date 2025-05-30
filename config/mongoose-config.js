const mongoose = require("mongoose");
const debug = require("debug")("development:mongoose");

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  debug("Connected to database")
})
.catch((err)=>{
  debug(err.message)
})

module.exports = mongoose.connection;