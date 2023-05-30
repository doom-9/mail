import React, { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import { message } from "antd";

function login() {
  const [user, setUser] = useState("dddm56605@gmail.com");

  const [pass, setPass] = useState("dezhjpodramscaia");

  const getTheTotalNumberOfEmails = async () => {
    try {
      const res = await ipcRenderer.invoke("getEmailCount", user, pass);
      localStorage.setItem("numberOfBackupEmails", String(res));
    } catch (error) {
      message.error(JSON.stringify(error));
    }
  };

  return <div onClick={getTheTotalNumberOfEmails}>login</div>;
}

export default login;
