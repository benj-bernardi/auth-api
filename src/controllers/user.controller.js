import pool from "../database/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function getMe(req, res, next){
  try {
    const userId = req.user.id;
    const result = await pool.query("SELECT id, name, email, created_at FROM users WHERE id = $1", [userId]);

    if (result.rows.length === 0){
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
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
      return res.status(409).json({ error: "Email already registered" });
    }

    const nameExists = await pool.query("SELECT 1 FROM users WHERE name = $1", [name]);

    if (nameExists.rows.length > 0){
      return res.status(409).json({ error: "Name already registered" });
    }

    // Password verification
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)){
      return res.status(400).json({
        error: "Password must be at least 8 characters long and contain at least one uppercase letter and one number"});
      }

    // Hash of the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]);
    
    const user = result.rows[0];
    
    const token = jwt.sign(
      { id: user.id},
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({message: "Registred successful", token});
  } catch (err){
    next(err);
  }
}

export async function loginUser(req, res, next){
  try {
    const { email, password } = req.body;

    if (!email || !password){
      return res.status(400).json({ error: "Email and Password are required" });
    }

    // Email verification 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)){
      return res.status(400).json({ error: "Invalid email format" });
    }

    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userExists.rows.length === 0){
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = userExists.rows[0];

    // Password verification
    const match = await bcrypt.compare(password, user.password);

    if (!match){
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  
    res.status(200).json({
      message: "Login successful",
      token, user: {
        id: user.id,
        name: user.name, 
        email: user.email
      }
    });
  } catch (err){
    next(err);
  }
}