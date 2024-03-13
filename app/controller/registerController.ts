import { Request, Response } from "express";
import prisma from "../DB/db.config";
import mjml2html from "mjml";
import nodemailer from "nodemailer";

interface RegistrationInput {
  eventId: number;
  userId: number;
  userEmail: string;
}

export const registerEvent = async (req: Request<RegistrationInput>, res: Response) => {
  try {
    const { eventId, userId, userEmail } = req.body;

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

    await transporter.sendMail(mailOptions);
    console.log(registration);

    return res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
