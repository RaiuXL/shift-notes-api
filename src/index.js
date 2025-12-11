const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Shift Notes API is running" });
});

// future route example:
// app.get("/notes", (req, res) => { ... });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});