import { ipcMain } from "electron";
import nodemailer from "nodemailer";

const mailConfigArray = [
  {
    key: "1",
    host: "imap.gmail.com",
    port: 993,
  },
  {
    key: "2",
    host: "outlook.office365.com",
    port: 993,
  },
  {
    key: "3",
    host: "outlook.office365.com",
    port: 993,
  },
];

function main(
  type: string,
  user: string,
  pass: string,
  to: string,
  subject: string,
  text: string
) {
  return new Promise((resolve, reject) => {
    const mailConfig = mailConfigArray.find((item) => item.key === type);

    if (!mailConfig) {
      throw Error("doNotSupportThisMailbox");
    }

    let transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: true,
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
        reject(error);
      } else {
        resolve(info.response);
      }
    });
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
    return await main(type, user, pass, to, subject, text);
  }
);
