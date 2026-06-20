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

module.exports = router;
