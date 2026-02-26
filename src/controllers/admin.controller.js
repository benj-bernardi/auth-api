import { getUsers, deleteUser} from "../models/admin.model.js";

export async function getAllUsers(req, res, next){
    try {
        const result = await getUsers();
        res.json(result);
    } catch (err){
        next(err);
    }
}

export async function deleteUserByID(req, res, next){
    try {
        const { id } = req.params;

        const deleteUserbyID = await deleteUser(id);

        if (!deleteUserbyID){
            return res.status(404).json({ error: "User not found" });
        }
    
        res.status(204).send();
    } catch (err){
        next(err);
    }
}

