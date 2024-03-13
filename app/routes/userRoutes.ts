import { createUser, loginUser } from "../controller/userController";
import { Router } from "express";

const router = Router();

router.post("/signup", createUser); // signup
router.post("/", loginUser); // login

export default router;
