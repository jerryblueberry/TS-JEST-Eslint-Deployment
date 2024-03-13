import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../DB/db.config";

interface DecodedToken extends JwtPayload {
  userId: number;
}

interface User {
  id: number;
  name: string | null;
  email: string;
  password: string | null;
  role: string;
  created_at: Date;
}

interface RequestWithUser extends Request {
  user?: User;
}

export const verifyAuth = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: "JWT must be provided" });
  }

  try {
    const decoded = jwt.verify(token, "MXIUuw6u5Ty0Ecih3XCjZ1+0575N2OTu0x9gsOl6pBc=") as DecodedToken;

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Unauthorized token" });
  }
};

export const isAdmin = (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    return res.status(403).json({ message: "Forbidden: Only admin can perform this action" });
  }
};
