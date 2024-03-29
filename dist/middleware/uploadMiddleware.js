"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// import { Request } from "express";
// Define types for the request and file
// interface MulterRequest extends Request {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   file: any; // Adjust the type according to your needs
// }
// interface File {
//   fieldname: string;
//   originalname: string;
//   encoding: string;
//   mimetype: string;
//   destination: string;
//   filename: string;
//   path: string;
//   size: number;
// }
// Define the storage configuration
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "files/"); // desired destination folder
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});
// Define the file filter function
// const fileFilter = (req: MulterRequest, file: File, cb: multer.FileFilterCallback) => {
//   // check if the file type is allowed
//   const allowedMimeTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file Type. Allowed types: JPEG, JPG, PNG, GIF"));
//   }
// };
// Define limits for file size
const limits = {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
};
// Configure Multer with the defined options
const singleUpload = (0, multer_1.default)({
    storage: storage,
    // fileFilter: fileFilter,
    limits: limits,
}).single("thumbnail");
exports.default = singleUpload;
