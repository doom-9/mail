import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { ipcRenderer } from "electron";
import { message } from "antd";

const GET_LOCATIONS = gql`
  query GetLocations {
    locations {
      id
      name
      description
      photo
    }
  }
`;

function login() {
  const { loading, error, data } = useQuery(GET_LOCATIONS);

  const [user, setUser] = useState("");

  const checkTheNewEmailRegularly = async () => {
    try {
      const res = await ipcRenderer.invoke("imap");
      const { length, mail } = res;
      console.log(res);
      localStorage.setItem("numberOfBackupEmails", String(length));
    } catch (error) {
      message.error(JSON.stringify(error));
    }
  };

  useEffect(() => {
    // checkTheNewEmailRegularly();
  }, []);

  return <div>login</div>;
}

export default login;
