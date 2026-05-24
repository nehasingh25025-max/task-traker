const express = require("express");

const router = express.Router();

const User = require("../models/User");

const {
  register,
  login,
} = require("../controllers/authController");

router.post("/register", register);

router.post("/login", login);

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);

  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;