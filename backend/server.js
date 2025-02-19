import dotenv from "dotenv";
import dbConnect from "./models/dbConnect.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import { authenticateToken } from "./utils.js";
import User from "./models/user.model.js";
import Note from "./models/note.model.js";
import bcrypt from "bcrypt";

import path from "path";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

const __dirname = path.resolve();

dbConnect();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
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

    const accessToken = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
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

// login api
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
    const accessToken = jwt.sign({ _id: isUser._id }, process.env.JWT_SECRET, {
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

// get user api
app.get("/get-user", authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const isUser = await User.findOne({ _id: user._id });

    if (!isUser) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    return res.status(200).json({
      error: false,
      user: {
        fullname: isUser.fullname,
        email: isUser.email,
        _id: isUser._id,
        createdOn: isUser.createdOn,
      },
      message: "Found",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// add note api
app.post("/add-note", authenticateToken, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const user = req.user;

    if (!title) {
      return res
        .status(400)
        .json({ error: true, message: "Title is required" });
    }

    if (!content) {
      return res
        .status(400)
        .json({ error: true, message: "Content is required" });
    }

    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });

    // console.log(user, note, "done here");

    await note.save();

    // console.log("Yaha tak save ho gya");

    return res
      .status(201)
      .json({ error: false, note, message: "Note added successfully" });
  } catch (err) {
    return res.status(500).json({ error: true, message: err });
  }
});

// update note api
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const user = req.user;

    if (!title && !content && !tags) {
      return res
        .status(400)
        .json({ error: true, message: "No changes provided" });
    }

    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    await note.save();

    return res
      .status(200)
      .json({ error: false, note, message: "Note updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: false, note, message: "Internal server error" });
  }
});

// get all notes api
app.get("/get-all-notes/", authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
    return res.status(200).json({
      error: false,
      notes,
      message: "All notes retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// delete note api
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const user = req.user;

    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({
        error: true,
        note,
        message: "Note not found",
      });
    }

    await Note.deleteOne({ _id: noteId, userId: user._id });
    return res.status(200).json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// update isPinned value
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const user = req.user;
    const { isPinned } = req.body;

    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({
        error: true,
        message: "Note not found",
      });
    }

    note.isPinned = isPinned;

    await note.save();

    return res.status(200).json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Search note
app.get("/search-notes/", authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        error: true,
        message: "Search query is required",
      });
    }

    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    return res.status(200).json({
      error: false,
      notes: matchingNotes,
      message: "Notes matching the search query retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
