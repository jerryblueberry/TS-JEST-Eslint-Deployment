import { createEvent, getAllEvents, getRegistrationDetails, getTodayEvents } from "../controller/eventController";
import { Router } from "express";
import singleUpload from "../middleware/uploadMiddleware";
import { isAdmin, verifyAuth } from "../middleware/authentication";

const router = Router();

router.post("/", singleUpload, verifyAuth, isAdmin, createEvent); // create event
router.get("/", verifyAuth, getAllEvents); // get all events
router.get("/today", verifyAuth, getTodayEvents);
router.get("/:id", verifyAuth, isAdmin, getRegistrationDetails); // get the specfic event with registration details
export default router;
