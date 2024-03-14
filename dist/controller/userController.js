"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createUser = void 0;
const db_config_1 = __importDefault(require("../DB/db.config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateTokenandSetCookie_js_1 = require("../utils/generateTokenandSetCookie.js");
const logger_1 = require("../logger");
const saltRounds = 10;
// create user (SignUp)
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = yield db_config_1.default.user.findUnique({
            where: {
                email: email,
            },
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        const newUser = yield db_config_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });
        return res.status(200).json({ newUser, message: "User created Successfully!" });
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.createUser = createUser;
// login (signin)
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = yield db_config_1.default.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password || "");
        if (!passwordMatch) {
            return res.status(403).json({ message: "Password didn't match" });
        }
        (0, generateTokenandSetCookie_js_1.generateTokenAndSetCookie)(user.id, (_a = user.name) !== null && _a !== void 0 ? _a : "", user.email, user.role, res);
        logger_1.logger.info(`Login Successfull for user ${user.name}`);
        res.status(200).json({ message: "Login successful", user });
    }
    catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.loginUser = loginUser;
