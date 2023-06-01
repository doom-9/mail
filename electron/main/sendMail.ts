import { ipcMain } from "electron";
import nodemailer from "nodemailer";

function main(
  type: string,
  user: string,
  pass: string,
  to: string,
  subject: string,
  text: string
) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user,
      pass,
    },
  });

  let mailOptions = {
    from: user,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

ipcMain.handle(
  "sendMail",
  async (
    _event,
    type: string,
    user: string,
    pass: string,
    to: string,
    subject: string,
    text: string
  ) => {
    try {
      const res = await main(type, user, pass, to, subject, text);
      return res;
    } catch (error) {
      return "";
    }
  }
);
