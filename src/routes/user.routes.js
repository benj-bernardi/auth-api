import { Router } from "express";
import { getMe, registerUser, loginUser, updateUser, deleteUser } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { loginLimiter } from "../middlewares/rateLimit.js";

const router = Router();

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginLimiter, loginUser);

// User Routes
router.get("/me", authMiddleware, getMe);
router.patch("/me", authMiddleware, updateUser);
router.delete("/me", authMiddleware, deleteUser)

export default router;