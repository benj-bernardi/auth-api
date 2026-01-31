import { Router } from "express";
import { getAllUsers, deleteUser } from "../controllers/admin.controller.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/users", authMiddleware, authorizeRoles(["admin"]), getAllUsers);
router.delete("/users/:id", authMiddleware, authorizeRoles(["admin"]), deleteUser);

export default router;