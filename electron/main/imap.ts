import { ipcMain } from "electron";
import { ImapFlow } from 'imapflow'
import { MailParser } from 'mailparser'



const main = async (user: string, pass: string, count: number, totalCount: number) => {
  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
      user,
      pass
    }
  });

  await client.connect();

  let lock = await client.getMailboxLock('INBOX');

  const messageArray = []
  try {
    for await (let message of client.fetch(`${totalCount}:${totalCount - count}`, { envelope: true, source: true })) {
      messageArray.push(message)
    }
  } finally {
    lock.release();
  }
  await client.logout();

  return messageArray
};

async function getEmailCount(user: string, pass: string) {
  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
      user,
      pass
    }
  });

  await client.connect();

  let lock = await client.getMailboxLock('INBOX');

  let length = typeof client.mailbox === 'boolean' ? 0 : client.mailbox.exists

  lock.release();

  await client.logout();

  return length;
}


ipcMain.handle('getTheLatestEmail', async (_event, user: string, pass: string, count: number, totalCount: number) => {
  try {
    const res = await main(user, pass, count, totalCount)
    return res
  } catch (error) {
    return ''
  }
})

ipcMain.handle('totalNumberOfEmails', async (_event, user: string, pass: string) => {
  try {
    const res = await getEmailCount(user, pass)
    return res
  } catch (error) {
    return 0
  }
})
