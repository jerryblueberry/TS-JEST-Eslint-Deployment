import { Router } from "express";
import { registerEvent } from "../controller/registerController";
import { verifyAuth } from "../middleware/authentication";
// import { verifyAuth } from "../middleware/authentication";
const router = Router();

router.post("/", verifyAuth, registerEvent);

export default router;
