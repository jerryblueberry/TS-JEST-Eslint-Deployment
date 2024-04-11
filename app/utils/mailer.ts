import { registrationMailTemplate } from "../emailTemplates/registraionMailTemplate";
import { verificationMailTemplate } from "../emailTemplates/verificationMailTemplate";

import nodemailer from "nodemailer";
import mjml2html from "mjml";

interface Event {
  title: string;
  description: string;
}
// Function to send verification email
export const sendVerificationEmail = async (email: string, otp: number) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "jerrytechs83@gmail.com",
        pass: "xhld yvin catr neyk",
      },
    });
    const { html } = mjml2html(verificationMailTemplate(otp));

    const mailOptions = {
      from: "jerrytechs83@gmail.com",
      to: email,
      subject: "Signup Verification",
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully!");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

export const sendRegistrationEmail = async (email: string, event: Event) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "jerrytechs83@gmail.com",
        pass: "xhld yvin catr neyk",
      },
    });
    const { html } = mjml2html(registrationMailTemplate(event));

    const mailOptions = {
      from: "jerrytechs83@gmail.com",
      to: email,
      subject: "Event Registration Successfull",
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error Occurred", error);
  }
};
