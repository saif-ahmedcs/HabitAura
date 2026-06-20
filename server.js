const express = require("express");
const habitsRouter = require("./routes/habits"); // importing

const app = express();
const PORT = 3000;

app.use(express.json()); // // Middleware to parse JSON request body

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/habits", habitsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
