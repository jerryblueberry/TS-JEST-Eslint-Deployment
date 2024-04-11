import { Response } from "express";
import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (
  userId: number,
  userName: string,
  userEmail: string,
  userRole: string,

  res: Response,
) => {
  const accessToken = jwt.sign(
    { userId, userName, userEmail, userRole },
    "MXIUuw6u5Ty0Ecih3XCjZ1+0575N2OTu0x9gsOl6pBc=",
    {
      expiresIn: "15s",
    },
  );
  console.log("Access Token", accessToken);

  const refreshToken = jwt.sign({ userId, userName, userEmail, userRole }, "refreshToken123", {
    expiresIn: "15d",
  });

  console.log("REfresh TOken", refreshToken);

  res.cookie("jwt", accessToken, {
    maxAge: 15 * 60 * 1000, // MS
    httpOnly: false, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
  });
};
