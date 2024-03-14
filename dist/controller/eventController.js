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
exports.sendTodayEvents = exports.getTodayEvents = exports.getRegistrationDetails = exports.getAllEvents = exports.createEvent = void 0;
const db_config_1 = __importDefault(require("../DB/db.config"));
const node_cron_1 = __importDefault(require("node-cron"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const mjml_1 = __importDefault(require("mjml"));
require("dotenv/config");
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, seats, price, date } = req.body;
        // const thumbnail = req.file ? req.file.path : "";
        const thumbnail = req.file ? req.file.path : "";
        if (!title || !description || !seats || !price) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newEvent = yield db_config_1.default.event.create({
            data: {
                title,
                description,
                thumbnail: thumbnail,
                seats: parseInt(seats),
                price: parseFloat(price),
                date: new Date(date),
            },
        });
        return res.status(200).json({ newEvent, message: "Event Created Successfully" });
    }
    catch (error) {
        console.log("Error creating event", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.createEvent = createEvent;
//  get all events
const getAllEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield db_config_1.default.event.findMany({
            orderBy: {
                created_at: "desc",
            },
        });
        res.status(200).json({ events });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAllEvents = getAllEvents;
//  get the specific event with the total number of users who have registered there details
const getRegistrationDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventId = parseInt(req.params.id);
        const eventWithRegistration = yield db_config_1.default.event.findUnique({
            where: {
                id: eventId,
            },
            include: {
                registrations: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        if (!eventWithRegistration) {
            return res.status(404).json({ message: "Event Not Found" });
        }
        const totalRegistrations = eventWithRegistration.registrations.length;
        return res.status(200).json({ event: eventWithRegistration, totalRegistrations });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getRegistrationDetails = getRegistrationDetails;
// endpoint to get the todays lists of the events
const getTodayEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        const timezoneOffset = today.getTimezoneOffset();
        today.setHours(0, 0 - timezoneOffset, 0, 0);
        const todayEvents = yield db_config_1.default.event.findMany({
            where: {
                date: {
                    equals: today,
                },
            },
        });
        console.log("Today date", today);
        res.status(200).json(todayEvents);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getTodayEvents = getTodayEvents;
const sendTodayEvents = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        const timezoneOffset = today.getTimezoneOffset();
        today.setHours(0, 0 - timezoneOffset, 0, 0); // Set the time to midnight for today in UTC
        const todayEvents = yield db_config_1.default.event.findMany({
            where: {
                date: {
                    equals: today,
                },
            },
        });
        // Compose email content with today's events in MJML format
        let mjmlContent = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text>
                <h1>Today's Events</h1>
              </mj-text>
            </mj-column>
          </mj-section>
    `;
        todayEvents.forEach((event, index) => {
            mjmlContent += `
          <mj-section>
            <mj-column>
              <mj-text>
                <p>${index + 1}. ${event.title}</p>
                <p>Description: ${event.description}</p>
              </mj-text>
            </mj-column>
          </mj-section>
      `;
        });
        mjmlContent += `
        </mj-body>
      </mjml>
    `;
        // Convert MJML to HTML
        const { html } = (0, mjml_1.default)(mjmlContent);
        // send email using Nodemailer
        const transporter = nodemailer_1.default.createTransport({
            // configure your email service provider here
            // for example,for gmail
            service: "gmail",
            auth: {
                user: "jerrytechs83@gmail.com",
                pass: "hcmj rbft sgdo bvcx",
            },
        });
        const mailOptions = {
            from: "jerrytechs83@gmail.com",
            to: "jerrytechs83@gmail.com",
            subject: "Today's Events List",
            html, // Use the converted HTML content
        };
        yield transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
});
exports.sendTodayEvents = sendTodayEvents;
const cron_schedule = process.env.CRON_SCHEDULE || "";
if (cron_schedule) {
    node_cron_1.default.schedule(cron_schedule, () => {
        console.log("Running cron job");
        (0, exports.sendTodayEvents)();
    });
}
else {
    console.error("CRON_SCHEDULE is not defined");
}
