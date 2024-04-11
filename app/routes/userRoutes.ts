import { createUser, handleStatus, loginUser } from "../controller/userController";
import { Router } from "express";

const router = Router();

router.post("/signup", createUser); // signup
router.post("/", loginUser); // login
router.post("/verify", handleStatus);
export default router;
