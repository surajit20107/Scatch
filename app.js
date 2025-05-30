const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const mongoose = require("./config/mongoose-config");
const session = require("express-session");
const flash = require("connect-flash");
const fileUpload = require("express-fileupload");

const indexRouter = require("./routes/indexRouter");
const ownerRouter = require("./routes/ownerRouter");
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter")

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.set("view engine", "ejs");

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash());
app.use(fileUpload());

app.use((req, res, next) => {
  res.locals.errorMessage = req.flash("error");
  res.locals.successMessage = req.flash("success");
  next();
});

app.use("/", indexRouter);
app.use("/owner", ownerRouter);
app.use("/user", userRouter);
app.use("/shop", productRouter);

app.listen(PORT, () => {
  console.log('Express server initialized');
});