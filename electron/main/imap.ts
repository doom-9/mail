import { ipcMain } from "electron";
import { ImapFlow } from 'imapflow'
import { MailParser } from 'mailparser'



const main = async (user: string, pass: string) => {
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

  const messageArray = []
  try {
    for await (let message of client.fetch([1, 2, 3], { envelope: true, source: true })) {
      messageArray.push(message)
    }
  } finally {
    lock.release();
  }
  await client.logout();

  return {
    mail: messageArray,
    length
  }
};

ipcMain.handle('imap', async (_event, type: 'Gmail' | 'Outlook', user: string, pass: string) => {
  try {
    const res = await main(user, pass)
    return res
  } catch (error) {
    return ''
  }
})
