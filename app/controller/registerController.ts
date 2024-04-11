import { Request, Response } from "express";
import prisma from "../DB/db.config";

import { logger } from "../logger";
import { sendRegistrationEmail } from "../utils/mailer";
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

    await sendRegistrationEmail(userEmail, event);
    // await transporter.sendMail(mailOptions);
    console.log(registration);
    logger.info(`Registered for event successfully by user ${userEmail} for the event ${eventId} `);

    return res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
