import pool from "../database/db.js";

export async function listUsers(req, res, next) {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}