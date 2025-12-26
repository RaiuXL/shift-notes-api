require("dotenv").config();

const pool = require("./db");
const notesRouter = require("./router/notes.js");
const express = require("express");
const app = express();
const PORT = process.env.PORT;

(async () => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    console.log("DB connected:", rows);
  } catch (err) {
    console.error("DB connection failed");
    console.error(err.message);
    process.exit(1);
  }
})();

app.use(express.json());
app.use("/api/notes", notesRouter);

app.get("/", (req, res) => {
  res.json({ message: "Shift Notes API is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
