const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const pool = require("./db");
const app = express();
app.use(bodyParser.json());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage });
const calculateAge = (dob) => {
  const dobDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  const m = today.getMonth() - dobDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }
  return age;
};

app.post("/api/employees", upload.none(), async (req, res) => {
  const { name, email, dob, address, photo } = req.body;

  let photoData = null;
  if (photo) {
    photoData = JSON.parse(photo);
  }

  const photoBinary = photoData;

  const dobDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  const m = today.getMonth() - dobDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }

  try {
    const result = await pool.query(
      `INSERT INTO employees (name, age, email, dob, address, photo)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
      [name, age, email, dob, address, photoBinary]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/employees/:id", upload.none(), async (req, res) => {
  const { id } = req.params;
  const { name, email, dob, address, photo } = req.body;

  let photoData = null;
  if (photo) {
    photoData = JSON.parse(photo);
  }

  const photoBinary = photoData;

  const dobDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  const m = today.getMonth() - dobDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }

  try {
    const result = await pool.query(
      `UPDATE employees
         SET name = $1, age = $2, email = $3, dob = $4, address = $5, photo = $6
         WHERE id = $7
         RETURNING *`,
      [name, age, email, dob, address, photoBinary, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/employees", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employees");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/employees/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM employees WHERE id = $1", [id]);
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
