import { Router } from "express";
import { listUsers, registerUser, loginUser } from "../controllers/user.controller.js";

const router = Router();

router.get("/", listUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
export default router;