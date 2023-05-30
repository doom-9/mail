import React from "react";
import { useQuery, gql } from "@apollo/client";

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
  return <div>login</div>;
}

export default login;
