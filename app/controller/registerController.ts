import { Request, Response } from "express";
import prisma from "../DB/db.config";
import mjml2html from "mjml";
import nodemailer from "nodemailer";
import { logger } from "../logger";
// interface RegistrationInput {
//   eventId: number;
// }

interface User {
  eventId: number;
  id: number;
  name: string;
  email: string;
  role: string;
}

interface RequestWithUser extends Request {
  user?: User;
}

export const registerEvent = async (req: RequestWithUser, res: Response) => {
  try {
    const { eventId } = req.body;
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    if (!userId || !userEmail) {
      return res.status(401).json({ message: "User information not provided" });
    }

    // Check if the event exists
    const event = await prisma.event.findUnique({
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
    const registration = await prisma.registration.create({
      data: {
        eventId,
        userId,
      },
    });

    // Decrease the event seat count by 1
    await prisma.event.update({
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

    const { html } = mjml2html(mjmlTemplate);

    // Send the email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "jerrytechs83@gmail.com",
        pass: "hcmj rbft sgdo bvcx",
      },
    });

    const mailOptions = {
      from: "jerrytechs83@gmail.com",
      to: userEmail,
      subject: "Event Registration Successful",
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(registration);
    logger.info(`Registered for event successfully by user ${userEmail} for the event ${eventId} `);

    return res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
