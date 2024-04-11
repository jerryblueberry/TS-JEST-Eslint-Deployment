"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controller/userController");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/signup", userController_1.createUser); // signup
router.post("/", userController_1.loginUser); // login
router.post("/verify", userController_1.handleStatus);
exports.default = router;
