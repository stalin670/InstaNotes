require("dotenv").config();
const mongoose = require("mongoose");
const dbConnect = require("./models/dbConnect.js");
const express = require("express");
const cors = require("cors");

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
