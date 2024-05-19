import React, { useEffect, useState } from "react";
import Tables from "./Tables";
import { USERS_QUERY } from "../utils/api/graphql/queries";
import { useQuery } from "@apollo/client";

function Users() {
  const [userTableData, setUserTableData] = useState([]);

  const { data: userData } = useQuery(USERS_QUERY, {
    variables: {},
    pollInterval: 10000,
  });

  useEffect(() => {
    if (userData?.GetUsers) {
      setUserTableData(
        userData?.GetUsers.map((user, idx) => ({
          "#": idx,
          Name: `${user.first_name} ${user.last_name}`,
          Gender: user.gender,
          Email: user.email,
          Country: user.country,
          State: user.state,
          city: user.city,
          Recommends: user.createdRecommendations.length,
        }))
      );
    }
  }, [userData]);

  return <Tables title="Users" tableData={userTableData}></Tables>;
}

export default Users;
