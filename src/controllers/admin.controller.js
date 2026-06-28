import { getAllUsers, deleteUserByID } from "../models/admin.model.js";

export async function getUsers(req, res, next){
    try {
        const result = await getAllUsers();
        res.json(result);
    } catch (err){
        next(err);
    }
}

export async function deleteUser(req, res, next){
    try {
        const { id } = req.params;

        const deleteUserbyID = await deleteUserByID(id);

        if (!deleteUserbyID){
            return res.status(404).json({ error: "User not found" });
        }
    
        res.status(204).send();
    } catch (err){
        next(err);
    }
}

