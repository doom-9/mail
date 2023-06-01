import { ipcMain } from "electron";
import { ImapFlow } from "imapflow";
import { MailParser } from "mailparser";

const mailConfigArray = [
  {
    key: "gmail",
    host: "imap.gmail.com",
    port: 993,
  },
  {
    key: "outlook",
    host: "outlook.office365.com",
    port: 993,
  },
];

// 获取新邮件
async function main(
  type: string,
  user: string,
  pass: string,
  count: number,
  totalCount: number
) {
  const mailConfig = mailConfigArray.find((item) => item.key === type);

  if (!mailConfig) {
    throw Error("doNotSupportThisMailbox");
  }

  const client = new ImapFlow({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: true,
    auth: {
      user,
      pass,
    },
  });

  await client.connect();

  let lock = await client.getMailboxLock("INBOX");

  const messageArray = [];
  try {
    for await (let message of client.fetch(
      `${totalCount}:${totalCount - count}`,
      { envelope: true, source: true }
    )) {
      messageArray.push(message);
    }
  } finally {
    lock.release();
  }
  await client.logout();

  return messageArray;
}

// 获取邮件总数量
async function getEmailCount(type: string, user: string, pass: string) {
  const mailConfig = mailConfigArray.find((item) => item.key === type);

  if (!mailConfig) {
    throw Error("doNotSupportThisMailbox");
  }

  const client = new ImapFlow({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: true,
    auth: {
      user,
      pass,
    },
  });

  await client.connect();

  let lock = await client.getMailboxLock("INBOX");

  let length = typeof client.mailbox === "boolean" ? 0 : client.mailbox.exists;

  lock.release();

  await client.logout();

  return length;
}

ipcMain.handle(
  "getTheLatestEmail",
  async (
    _event,
    type: string,
    user: string,
    pass: string,
    count: number,
    totalCount: number
  ) => {
    return await main(type, user, pass, count, totalCount);
  }
);

ipcMain.handle(
  "totalNumberOfEmails",
  async (_event, type: string, user: string, pass: string) => {
    return await getEmailCount(type, user, pass);
  }
);
