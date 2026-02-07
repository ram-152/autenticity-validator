const express = require("express");
const bcrypt = require("bcryptjs");
const { auth, adminOnly } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Certificate = require("../models/Certificate");

const router = express.Router();

// Admin dashboard data
router.get("/dashboard", auth, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  const certificates = await Certificate.find();
  res.json({ users, certificates });
});

// Admin creates new users
router.post("/create-user", auth, adminOnly, async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      password: hashed,
      role: role === "admin" ? "admin" : "user",
    });

    await user.save();
    res.json({ msg: "User created successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
