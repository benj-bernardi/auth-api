import pool from "../database/db.js";

export async function getAllUsers() {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
}

export async function deleteUserByID(id) {
    const result = await pool.query(
        "DELETE FROM users WHERE id = $1 RETURNING *",
        [id]
    );

    return result.rows[0];
}