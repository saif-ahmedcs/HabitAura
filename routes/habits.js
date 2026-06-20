const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const habits = require("../data/habits");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    res.status(200).json(habits);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "title is required" });
    }

    const habit = {
      id: habits.length + 1,
      title,
    };

    habits.push(habit);
    res.status(201).json(habit);
  }),
);

module.exports = router;
