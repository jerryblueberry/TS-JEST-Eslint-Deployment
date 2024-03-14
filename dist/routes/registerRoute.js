"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registerController_1 = require("../controller/registerController");
const authentication_1 = require("../middleware/authentication");
// import { verifyAuth } from "../middleware/authentication";
const router = (0, express_1.Router)();
router.post("/", authentication_1.verifyAuth, registerController_1.registerEvent);
exports.default = router;
