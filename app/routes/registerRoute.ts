import { Router } from "express";
import { registerEvent } from "../controller/registerController";
// import { verifyAuth } from "../middleware/authentication";
const router = Router();

router.post("/", registerEvent);

export default router;
