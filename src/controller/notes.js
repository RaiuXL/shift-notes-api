const pool = require("../db");
const { z } = require("zod");

const noteSchema = z.object({
  residentId: z.number().int().positive().optional().nullable(),
  noteType: z.enum(["resident", "staff"]),
  shift: z.enum(["AM", "PM", "NOC"]),
  authorName: z.string().min(1),
  category: z.string().max(100),
  body: z.string().min(1),
});

const listNotes = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT notes.*, residents.full_name AS resident_name
      FROM notes
      LEFT JOIN residents ON notes.resident_id = residents.id
      ORDER BY notes.created_at DESC
    `
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to load notes" });
  }
};

const createNote = async (req, res) => {
  try {
    const {
      residentId = null,
      noteType,
      shift,
      authorName,
      category,
      body,
    } = noteSchema.parse(req.body);

    const [result] = await pool.query(
      `INSERT INTO notes (resident_id, note_type, shift, author_name, category, body)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [residentId, noteType, shift, authorName, category, body]
    );

    const [[note]] = await pool.query(
      `SELECT notes.*, residents.full_name AS resident_name
      FROM notes
      LEFT JOIN residents ON notes.resident_id = residents.id
      WHERE notes.id = ?
    `,
      [result.insertId]
    );

    res.status(201).json(note);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }

    console.error(err);
    res.status(500).json({ error: "Unable to create note" });
  }
};

module.exports = {
  listNotes,
  createNote,
};
