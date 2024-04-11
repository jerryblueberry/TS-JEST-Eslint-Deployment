import { Request, Response } from "express";
import prisma from "../DB/db.config";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../utils/generateTokenandSetCookie.js";
import { logger } from "../logger";

import { sendVerificationEmail } from "../utils/mailer";

const saltRounds = 10;

interface UserCreateInput {
  name?: string;
  email: string;
  password?: string;
  role: string;
  thumbnail: string;
  status: string;
}

const generateOTP = async (): number => {
  const otpLength = 6;
  const min = Math.pow(10, otpLength - 1);
  const max = Math.pow(10, otpLength) - 1;
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  return otp;
};
// Example usage

// create user (SignUp)
export const createUser = async (req: Request<UserCreateInput>, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const otp = generateOTP();
    console.log("Generated OTP:", otp);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        OTP: otp,
      },
    });

    await sendVerificationEmail(email, otp);

    return res.status(200).json({ newUser, message: "User created Successfully!" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//  verify otp and set the status to verified
export const handleStatus = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (otp === user.OTP) {
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          status: "verified",
        },
      });
      return res.status(200).json({ message: "User verified Successfully", user: updatedUser });
    } else {
      return res.status(401).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.log("Error Occurred", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// login (signin)
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password || "");

    if (!passwordMatch) {
      return res.status(403).json({ message: "Password didn't match" });
    }
    if (user.status !== "verified") {
      return res.status(400).json({ message: "User not verified" });
    }

    generateTokenAndSetCookie(user.id, user.name ?? "", user.email, user.role, res);
    logger.info(`Login Successfull for user ${user.name}`);

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
