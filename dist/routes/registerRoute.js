"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registerController_1 = require("../controller/registerController");
// import { verifyAuth } from "../middleware/authentication";
const router = (0, express_1.Router)();
router.post("/", registerController_1.registerEvent);
exports.default = router;
