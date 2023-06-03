import React, { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import { message } from "antd";
import { gql, useMutation } from "@apollo/client";
import { FetchMessageObject } from "imapflow";

import { ParsedMail } from "mailparser";

const ADD_MAIL = gql`
  mutation CreateLeadsForApp($input: NewEmailLeadsInput!) {
    createLeadsForApp(input: $input) {
      email_id
      html_body
      subject
      text_body
      date
      from_email
      token
    }
  }
`;

function List() {
  const emailType = localStorage.getItem("emailType") || "";

  const email = localStorage.getItem("email") || "";

  const pass = localStorage.getItem("pass") || "";

  const kunproKey = localStorage.getItem("kunproKey") || "";

  const [Timer, setTimer] = useState<NodeJS.Timer | null>(null);

  const [messageApi, contextHolder] = message.useMessage();

  const [addMail] = useMutation(ADD_MAIL);

  // 每十分钟检查一次邮件数量
  async function checkTheNewMail() {
    console.log("执行一次");

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
        const newMailArray: (FetchMessageObject & {
          analyticalResults: ParsedMail;
        })[] = await ipcRenderer.invoke(
          "getTheLatestEmail",
          emailType,
          email,
          pass,
          res - numberOfCacheMail - 1,
          res
        );

        for (const item of newMailArray) {
          addMail({
            variables: {
              email_id: item.emailId,
              html_body: item.analyticalResults.html,
              subject: item.envelope.subject,
              text_body: item.analyticalResults.text,
              date: item.envelope.date.getTime(),
              from_email: item.envelope.from[0].address,
              token: kunproKey,
            },
          });
        }
      }
    } catch (error) {
      console.log(error);

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

      if (!Timer) {
        setTimer(
          setInterval(() => {
            checkTheNewMail();
          }, 1 * 60 * 1000)
        );
      }
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

  return (
    <>
      {contextHolder}
      <div>111</div>
    </>
  );
}

export default List;
