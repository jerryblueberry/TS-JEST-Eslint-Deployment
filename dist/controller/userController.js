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
exports.loginUser = exports.handleStatus = exports.createUser = void 0;
const db_config_1 = __importDefault(require("../DB/db.config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateTokenandSetCookie_js_1 = require("../utils/generateTokenandSetCookie.js");
const logger_1 = require("../logger");
const mailer_1 = require("../utils/mailer");
const saltRounds = 10;
const generateOTP = () => __awaiter(void 0, void 0, void 0, function* () {
    const otpLength = 6;
    const min = Math.pow(10, otpLength - 1);
    const max = Math.pow(10, otpLength) - 1;
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    return otp;
});
// Example usage
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
        const otp = generateOTP();
        console.log("Generated OTP:", otp);
        const newUser = yield db_config_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                OTP: otp,
            },
        });
        yield (0, mailer_1.sendVerificationEmail)(email, otp);
        return res.status(200).json({ newUser, message: "User created Successfully!" });
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.createUser = createUser;
//  verify otp and set the status to verified
const handleStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = yield db_config_1.default.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (otp === user.OTP) {
            const updatedUser = yield db_config_1.default.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    status: "verified",
                },
            });
            return res.status(200).json({ message: "User verified Successfully", user: updatedUser });
        }
        else {
            return res.status(401).json({ message: "Invalid OTP" });
        }
    }
    catch (error) {
        console.log("Error Occurred", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.handleStatus = handleStatus;
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
        if (user.status !== "verified") {
            return res.status(400).json({ message: "User not verified" });
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
