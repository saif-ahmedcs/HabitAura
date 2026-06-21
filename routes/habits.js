const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const habits = require("../data/habits");
const pool = require("../db");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM habits");
    res.status(200).json(rows);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "title is required" });
    }

    const [result] = await pool.query("INSERT INTO habits (title) VALUES (?)", [
      title,
    ]);

    const [rows] = await pool.query("SELECT * FROM habits WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json(rows[0]);
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "invalid id" });
    }

    const [rows] = await pool.query("SELECT * FROM habits WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "habit not found" });
    }

    res.status(200).json(rows[0]);
  }),
);

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "invalid id" });
    }

    const [rows] = await pool.query("SELECT * FROM habits WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "habit not found" });
    }

    const habit = rows[0];
    const { title, target_days } = req.body;

    if (title !== undefined && title.trim() === "") {
      return res.status(400).json({ error: "title is required" });
    }

    if (target_days !== undefined && target_days <= 0) {
      return res
        .status(400)
        .json({ error: "target_days must be greater than 0" });
    }

    const updatedTitle = title !== undefined ? title : habit.title;
    const updatedTargetDays =
      target_days !== undefined ? target_days : habit.target_days;

    const isNoOp =
      updatedTitle === habit.title && updatedTargetDays === habit.target_days;

    if (isNoOp) {
      return res.status(200).json(habit);
    }

    await pool.query(
      "UPDATE habits SET title = ?, target_days = ? WHERE id = ?",
      [updatedTitle, updatedTargetDays, id],
    );

    const [updatedRows] = await pool.query(
      "SELECT * FROM habits WHERE id = ?",
      [id],
    );

    res.status(200).json(updatedRows[0]);
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const index = habits.findIndex((h) => h.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "habit not found" });
    }

    habits.splice(index, 1);
    res.status(204).send();
  }),
);

module.exports = router;
