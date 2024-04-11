"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventController_1 = require("../controller/eventController");
const express_1 = require("express");
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware"));
const authentication_1 = require("../middleware/authentication");
const router = (0, express_1.Router)();
router.post("/", uploadMiddleware_1.default, authentication_1.verifyAuth, authentication_1.isAdmin, eventController_1.createEvent); // create event
router.get("/", authentication_1.verifyAuth, eventController_1.getAllEvents); // get all events
router.get("/today", authentication_1.verifyAuth, eventController_1.getTodayEvents);
router.get("/:id", authentication_1.verifyAuth, authentication_1.isAdmin, eventController_1.getRegistrationDetails); // get the specfic event with registration details
exports.default = router;
