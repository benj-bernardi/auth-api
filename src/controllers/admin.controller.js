import { getAllUsers, deleteUserByID } from "../models/admin.model.js";

export async function getUsers(req, res, next) {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        next(err);
    }
}

export async function deleteUser(req, res, next) {
    try {
        const { id } = req.params;

        const deleted = await deleteUserByID(id);

        if (!deleted) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}
