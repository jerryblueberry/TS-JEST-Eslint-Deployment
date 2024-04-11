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
exports.sendRegistrationEmail = exports.sendVerificationEmail = void 0;
const registraionMailTemplate_1 = require("../emailTemplates/registraionMailTemplate");
const verificationMailTemplate_1 = require("../emailTemplates/verificationMailTemplate");
const nodemailer_1 = __importDefault(require("nodemailer"));
const mjml_1 = __importDefault(require("mjml"));
// Function to send verification email
const sendVerificationEmail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "jerrytechs83@gmail.com",
                pass: "xhld yvin catr neyk",
            },
        });
        const { html } = (0, mjml_1.default)((0, verificationMailTemplate_1.verificationMailTemplate)(otp));
        const mailOptions = {
            from: "jerrytechs83@gmail.com",
            to: email,
            subject: "Signup Verification",
            html,
        };
        yield transporter.sendMail(mailOptions);
        console.log("Verification email sent successfully!");
    }
    catch (error) {
        console.error("Error sending verification email:", error);
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
const sendRegistrationEmail = (email, event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "jerrytechs83@gmail.com",
                pass: "xhld yvin catr neyk",
            },
        });
        const { html } = (0, mjml_1.default)((0, registraionMailTemplate_1.registrationMailTemplate)(event));
        const mailOptions = {
            from: "jerrytechs83@gmail.com",
            to: email,
            subject: "Event Registration Successfull",
            html,
        };
        yield transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.log("Error Occurred", error);
    }
});
exports.sendRegistrationEmail = sendRegistrationEmail;
