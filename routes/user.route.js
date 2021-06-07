const express = require("express");
const router = express.Router();
const User = require("../models/user.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const protectRoute = require("../util/protectRoute");

router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.json({
      message: "thank you for creating new user",
      user: newUser,
      success: true,
    });
  } catch (err) {
    res
      .status(401)
      .json({ name: err.name, message: err.message, url: req.originalUrl });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email: email });
    if (user == null) throw new Error("this email i not in your db");
    if (!bcrypt.compareSync(password, user.password))
      throw Error("password is wrong");
    user.password = undefined;
    let token = jwt.sign({ user }, process.env.SECRETKEY, {
      expiresIn: 60 * 60 * 1000,
    });
    res.json({ message: "login success", token });
  } catch (err) {
    console.log("error ! login failed");
    res
      .status(401)
      .json({ name: err.name, message: err.message, url: req.originalUrl });
  }
});

router.get("/allusers", protectRoute, async (req, res) => {
  try {
    const allUser = await User.find();
    res.status(200).json({ allUser });
  } catch (err) {
    res
      .status(404)
      .json({ name: err.name, message: err.message, url: req.originalUrl });
  }
});

module.exports = router;
