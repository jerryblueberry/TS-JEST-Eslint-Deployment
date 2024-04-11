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
exports.isAdmin = exports.verifyAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_config_1 = __importDefault(require("../DB/db.config"));
const verifyAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.cookies.jwt;
    const refreshToken = req.cookies.refreshToken;
    // Check if access token or refresh token is provided
    if (!accessToken && !refreshToken) {
        return res.status(401).json({ error: "JWT must be provided" });
    }
    let decoded = null; // Initialize decoded to null
    try {
        // Verify access token
        if (accessToken) {
            decoded = jsonwebtoken_1.default.verify(accessToken, "MXIUuw6u5Ty0Ecih3XCjZ1+0575N2OTu0x9gsOl6pBc=");
        }
        // Verify refresh token
        else if (refreshToken) {
            decoded = jsonwebtoken_1.default.verify(refreshToken, "refreshToken123");
        }
        // If token is invalid, return unauthorized error
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid token" });
        }
        // Find user based on userId from decoded token
        const user = yield db_config_1.default.user.findUnique({
            where: { id: decoded.userId },
        });
        // If user not found, return error
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Include user object in the request object
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ message: "Unauthorized token" });
    }
});
exports.verifyAuth = verifyAuth;
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "Admin") {
        next();
    }
    else {
        return res.status(403).json({ message: "Forbidden: Only admin can perform this action" });
    }
};
exports.isAdmin = isAdmin;
