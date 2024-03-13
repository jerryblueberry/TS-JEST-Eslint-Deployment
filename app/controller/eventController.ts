import { Request, Response } from "express";
import prisma from "../DB/db.config";
import cron from "node-cron";
import nodemailer from "nodemailer";
import mjml2html from "mjml";
import "dotenv/config";

//  create event
interface EventCreateInput {
  title: string;
  description: string;
  thumbnail: string;
  seats: number;
  price: number;
  date: Date;
}
// Extend the Request interface to include the 'user' property
interface RequestWithUser extends Request {
  user?: EventCreateInput;
}
// export const createEvent = async (req: Request<EventCreateInput>, res: Response) => {
// export const createEvent: RequestHandler<EventCreateInput> = async (req, res) => {
//   try {
//     const { title, description, thumbnail, seats, price, date } = req.body as EventCreateInput;

//     if (!title || !description || !seats || !price) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
//     const newEvent = await prisma.event.create({
//       data: {
//         title,
//         description,
//         thumbnail,
//         seats,
//         price,
//         date,
//       },
//     });

//     return res.status(200).json({ newEvent, message: "Event Created Successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const createEvent = async (req: RequestWithUser, res: Response) => {
  try {
    const { title, description, seats, price, date } = req.body;

    const thumbnail = req.file ? req.file.path : "";
    if (!title || !description || !seats || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        thumbnail: thumbnail,
        seats,
        price,
        date,
      },
    });

    return res.status(200).json({ newEvent, message: "Event Created Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//  get all events
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//  get the specific event with the total number of users who have registered there details
export const getRegistrationDetails = async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.id);

    const eventWithRegistration = await prisma.event.findUnique({
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
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// endpoint to get the todays lists of the events
export const getTodayEvents = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset();
    today.setHours(0, 0 - timezoneOffset, 0, 0);

    const todayEvents = await prisma.event.findMany({
      where: {
        date: {
          equals: today,
        },
      },
    });
    console.log("Today date", today);
    res.status(200).json(todayEvents);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendTodayEvents = async () => {
  try {
    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset();
    today.setHours(0, 0 - timezoneOffset, 0, 0); // Set the time to midnight for today in UTC

    const todayEvents = await prisma.event.findMany({
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
    const { html } = mjml2html(mjmlContent);

    // send email using Nodemailer
    const transporter = nodemailer.createTransport({
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

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const cron_schedule = process.env.CRON_SCHEDULE || "";
if (cron_schedule) {
  cron.schedule(cron_schedule, () => {
    console.log("Running cron job");
    sendTodayEvents();
  });
} else {
  console.error("CRON_SCHEDULE is not defined");
}
