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
exports.registerEvent = void 0;
const db_config_1 = __importDefault(require("../DB/db.config"));
const mjml_1 = __importDefault(require("mjml"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const registerEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId, userId, userEmail } = req.body;
        // Check if the event exists
        const event = yield db_config_1.default.event.findUnique({
            where: {
                id: eventId,
            },
        });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        // Check if there are available seats
        if (event.seats <= 0) {
            return res.status(400).json({ message: "Event is already full" });
        }
        // Create the registration
        const registration = yield db_config_1.default.registration.create({
            data: {
                eventId,
                userId,
            },
        });
        // Decrease the event seat count by 1
        yield db_config_1.default.event.update({
            where: {
                id: eventId,
            },
            data: {
                seats: {
                    decrement: 1,
                },
            },
        });
        // Send email with MJML template
        const mjmlTemplate = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text>
                <h1>Registration Successful</h1>
                <p>Thank you for registering for the event "${event.title}".</p>
                <p>Event Details:</p>
                <p>Title: ${event.title}</p>
                <p>Description: ${event.description}</p>
                
              </mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `;
        const { html } = (0, mjml_1.default)(mjmlTemplate);
        // Send the email using Nodemailer
        const transporter = nodemailer_1.default.createTransport({
            // Configure your email service provider here
            // For example, for Gmail:
            service: "gmail",
            auth: {
                user: "jerrytechs83@gmail.com",
                pass: "hcmj rbft sgdo bvcx",
            },
        });
        const mailOptions = {
            from: "jerrytechs83@gmail.com",
            to: `${userEmail}`, // Change this to the user's email address
            subject: "Event Registration Successfull",
            html,
        };
        yield transporter.sendMail(mailOptions);
        console.log(registration);
        return res.status(200).json({ message: "Registration successful" });
    }
    catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.registerEvent = registerEvent;
