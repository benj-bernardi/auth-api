import pool from "../database/db.js";
import bcrypt from "bcrypt";

export async function listUsers(req, res, next){
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err){
    next(err);
  }
}

export async function registerUser(req, res, next){
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password){
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)){
      return res.status(400).json({ error: "Invalid email format" });
    }

    // User verification 
    const userExists = await pool.query("SELECT 1 FROM users WHERE email = $1", [email]);

    if (userExists.rows.length > 0){
      return res.status(400).json({ error: "Email already registered" });
    }

    const nameExists = await pool.query("SELECT 1 FROM users WHERE name = $1", [name]);

    if (nameExists.rows.length > 0){
      return res.status(400).json({ error: "Name already registred" });
    }

     // Password verification
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)){
      return res.status(400).json({
        error: "Password must be at least 8 characters long and contain at least one uppercase letter and one number"})
      }

    // Hash of the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]);

    res.status(201).json(result.rows[0]);
  } catch (err){
    next(err);
  }
}
