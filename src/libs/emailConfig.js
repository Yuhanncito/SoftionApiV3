import config from "../config"
import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: config.MAILUSER,
      pass: config.MAILPASS,
    },
  });