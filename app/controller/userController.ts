import { Request, Response } from "express";
import prisma from "../DB/db.config";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../utils/generateTokenandSetCookie.js";
const saltRounds = 10;

interface UserCreateInput {
  name?: string;
  email: string;
  password?: string;
  role: string;
  thumbnail: string;
}
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

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return res.status(200).json({ newUser, message: "User created Successfully!" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
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

    generateTokenAndSetCookie(user.id, user.name ?? "", user.email, user.role, res);

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
