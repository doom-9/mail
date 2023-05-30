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
