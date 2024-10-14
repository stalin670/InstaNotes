require("dotenv").config();
const mongoose = require("mongoose");
const dbConnect = require("./models/dbConnect.js");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utils.js");
const User = require("./models/user.model.js");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT;

dbConnect();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  return res.json({ data: "Hello Js" });
});

// APIs

// create-account
app.post("/create-account", async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname) {
      return res.status(400).json({ error: true, message: "Name is required" });
    }

    if (!email) {
      return res
        .status(400)
        .json({ error: true, message: "Email is required" });
    }

    if (!password) {
      return res
        .status(400)
        .json({ error: true, message: "Password is required" });
    }

    const user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(409)
        .json({ message: "User already exists !", error: true });
    }
    const newUser = new User({ fullname, email, password });
    console.log(newUser, "p 1");
    newUser.password = await bcrypt.hash(password, 10);
    await newUser.save();

    const accessToken = jwt.sign({ newUser }, process.env.JWT_SECRET, {
      expiresIn: "36000m",
    });

    return res.status(201).json({
      message: "Signup Successfully.",
      error: false,
      newUser,
      accessToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: true });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ error: true, message: "Email is required" });
    }

    if (!password) {
      return res
        .status(400)
        .json({ error: true, message: "Password is required" });
    }

    const isUser = await User.findOne({ email: email });

    if (!isUser) {
      return res
        .status(404)
        .json({ error: true, message: "User does not exist" });
    }

    const comparePassword = await bcrypt.compare(password, isUser.password);
    if (!comparePassword) {
      return res
        .status(403)
        .json({ error: true, message: "Password is incorrect" });
    }

    const user = { user: isUser };
    const accessToken = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "36000m",
    });

    return res.status(200).json({
      error: false,
      message: "User logged in successfully",
      email,
      accessToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
