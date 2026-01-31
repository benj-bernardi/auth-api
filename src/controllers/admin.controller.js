import pool from "../database/db.js";

export async function getAllUsers(req, res, next){
    try {
        const result = await pool.query("SELECT id, name, email, role, created_at FROM users");
        res.json(result.rows);
    } catch (err){
        next(err);
    }
}

export async function deleteUser(req, res, next){
    try {
        const { id } = req.params;

        const deleteUser = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);

        if (deleteUser.rows.length === 0){
            return res.status(404).json({ error: "User not found" });
        }
    
        res.status(204).send();
    } catch (err){
        next(err);
    }
}

