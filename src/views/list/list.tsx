import React, { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import { message } from "antd";

function login() {
  const emailType = localStorage.getItem("emailType") || "";

  const email = localStorage.getItem("email") || "";

  const pass = localStorage.getItem("pass") || "";

  const [Timer, setTimer] = useState<NodeJS.Timer | null>(null);

  const [messageApi, contextHolder] = message.useMessage();

  // 每十分钟检查一次邮件数量
  async function checkTheNewMail() {
    try {
      const numberOfCacheMail = Number(
        localStorage.getItem("numberOfCacheMail")
      );

      const res = await ipcRenderer.invoke(
        "totalNumberOfEmails",
        emailType,
        email,
        pass
      );

      localStorage.setItem("numberOfCacheMail", String(res));

      // 对比出新邮件
      if (res > numberOfCacheMail) {
        const newMailArray = await ipcRenderer.invoke(
          "getTheLatestEmail",
          emailType,
          email,
          pass,
          res - numberOfCacheMail,
          res
        );

        console.log(newMailArray);
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: JSON.stringify(error),
      });
    }
  }

  // 获取邮件数量
  async function getTheNumberOfInitialEmails() {
    try {
      const res = await ipcRenderer.invoke(
        "totalNumberOfEmails",
        emailType,
        email,
        pass
      );

      localStorage.setItem("numberOfCacheMail", String(res));

      setTimer(
        setInterval(() => {
          checkTheNewMail();
        }, 10 * 60 * 1000)
      );
    } catch (error) {
      messageApi.open({
        type: "error",
        content: JSON.stringify(error),
      });
    }
  }

  useEffect(() => {
    getTheNumberOfInitialEmails();

    return () => {
      if (Timer) {
        clearInterval(Timer);
      }
    };
  }, []);

  return <div>111</div>;
}

export default login;
