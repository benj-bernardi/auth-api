import { Router } from "express";
import { getAllUsers, deleteUserByID } from "../controllers/admin.controller.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/users", authMiddleware, authorizeRoles(["admin"]), getAllUsers);
router.delete("/users/:id", authMiddleware, authorizeRoles(["admin"]), deleteUserByID);

export default router;