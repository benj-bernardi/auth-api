import { Router } from "express";
import { getUsers, deleteUser } from "../controllers/admin.controller.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// Admin Routes
router.get("/users", authMiddleware, authorizeRoles(["admin"]), getAllUsers);
router.delete("/users/:id", authMiddleware, authorizeRoles(["admin"]), deleteUserByID);

export default router;