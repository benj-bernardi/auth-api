import pool from "../database/db.js";
import { token } from "../utils/generateToken.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { isValidEmail, isValidUsername, isValidPassword } from "../utils/regexVerification.js";

export async function getMe(req, res, next){
    try {
        const userId = req.user.id;

        const result = await pool.query("SELECT id, email, created_at, name FROM users WHERE id = $1", [userId]);
        
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

        // Email verification 
        if (!isValidEmail(email)) return res.status(400).json({ error: "Invalid email format" });

        // Name verification
        if (!isValidUsername(name)) return res.status(400).json({ error: "Username must be 3-20 characters and contain only letters, numbers, or underscores." });

        // Password verification 
        if (!isValidPassword(password)) return res.status(400).json({ error: "Password must be 8-64 chars, include upper, lower and number." });

        // User verification 
        const userExists = await pool.query("SELECT 1 FROM users WHERE email = $1", [email]);

        if (userExists.rows.length > 0){
            return res.status(409).json({ error: "Email already registered" });
        }
    
        const nameExists = await pool.query("SELECT 1 FROM users WHERE name = $1", [name]);

        if (nameExists.rows.length > 0){
            return res.status(409).json({ error: "Name already registered" });
        }
        
        // Hash the password
        const hashedPassword = await hashPassword(password);

        const result = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role",
            [name, email, hashedPassword]
        );

        const user = result.rows[0];

        // JWT token
        const jwtToken = token({ id: user.id, role: user.role });

        res.status(201).json({ message: "Registered successfully", token: jwtToken });
    } catch (err){
        next(err);
    }
}

export async function loginUser(req, res, next){
    try {
        const { email, password } = req.body;

        if (!email || !password){
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Email format verification
        if (!isValidEmail(email)) return res.status(400).json({ error: "Invalid email format" });

        const userExists = await pool.query("SELECT 1 FROM users WHERE email = $1", [email]);

        if (userExists.rows.length === 0){
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = userExists.rows[0];

        // Password verification 
        const match = await comparePassword(password, user.password);

        if (!match) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const jwtToken = token({ id: user.id, role: user.role });

        res.status(200).json({
            message: "Login successful",
            token: jwtToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (err){
        next(err);
    }
};

export async function updateUser(req, res, next){
  try {
    const { name, email, password } = req.body;
    const user_id = req.user.id

    if (name === undefined && email === undefined && password === undefined){
      return res.status(400).json({ error: "Nothing to update" });
    }

    if (name !== undefined){
      if (!isValidUsername(name)) return res.status(400).json({ error: "Username must be 3-20 characters and contain only letters, numbers, or underscores." });

      const nameExists = await pool.query("SELECT 1 FROM users WHERE name = $1 AND id != $2", [name, user_id]);
      if (nameExists.rows.length > 0){
        return res.status(400).json({ error: "Name already registered" }); 
      }
    }

    if (email !== undefined){
        if (!isValidEmail(email)) return res.status(400).json({ error: "Invalid email format" });

        const userExists = await pool.query("SELECT 1 FROM users WHERE email = $1 AND id != $2", [email, user_id]);

        if (userExists.rows.length > 0){
            return res.status(400).json({ error: "Email already registered" });
        }
    }

    let hashedPassword;

    if (password !== undefined){
        if (!isValidPassword(password)) {
          return res.status(400).json({ error: "Password must be 8-64 chars, include upper, lower and number." });
        }

        const userPassword = await pool.query("SELECT password FROM users WHERE id = $1", [user_id]);
        if (userPassword.rows.length === 0) return res.status(404).json({ error: "User not found" });

        const hashedPasswordFromDB = userPassword.rows[0].password;

        const match = await comparePassword(password, hashedPasswordFromDB);

        if (match){
            return res.status(400).json({ error: "The password must be different from the current one" });
        }
                    
        hashedPassword = await hashPassword(password);
    }

    const updateUser = await pool.query(
        `UPDATE users 
        SET name = COALESCE($1, name),
            email = COALESCE($2, email),
            password = COALESCE($3, password)
        WHERE id = $4`,
        [name, email, hashedPassword ?? null, user_id]
    );
    
    
    res.status(204).send();
  } catch (err){
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    next(err);
  }
}