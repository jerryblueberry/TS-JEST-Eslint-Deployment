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
  createdAt: Date;
}

interface RequestWithUser extends Request {
  user?: User;
}

export const verifyAuth = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.jwt;
  const refreshToken = req.cookies.refreshToken;

  // Check if access token or refresh token is provided
  if (!accessToken && !refreshToken) {
    return res.status(401).json({ error: "JWT must be provided" });
  }

  let decoded: DecodedToken | null = null; // Initialize decoded to null

  try {
    // Verify access token
    if (accessToken) {
      decoded = jwt.verify(accessToken, "MXIUuw6u5Ty0Ecih3XCjZ1+0575N2OTu0x9gsOl6pBc=") as DecodedToken;
    }
    // Verify refresh token
    else if (refreshToken) {
      decoded = jwt.verify(refreshToken, "refreshToken123") as DecodedToken;
    }

    // If token is invalid, return unauthorized error
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    // Find user based on userId from decoded token
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    // If user not found, return error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Include user object in the request object
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
