import React, { useEffect, useState } from "react";
import Tables from "./Tables";
import { ORGANISATIONS_QUERY } from "../utils/api/graphql/queries";
import { useQuery } from "@apollo/client";

function Organisations() {
  const [organisationTableData, setOrganisationTableData] = useState([]);

  const { data: organisationData } = useQuery(ORGANISATIONS_QUERY, {
    variables: {},
    pollInterval: 10000,
  });

  useEffect(() => {
    if (organisationData?.GetOrganisations) {
      setOrganisationTableData(
        organisationData?.GetOrganisations.map((organisation, idx) => ({
          "#": idx,
          Name: organisation.name,
          Industry: organisation.industry,
          Description: organisation.description,
          Country: organisation.country,
          city: organisation.city,
          Users: organisation.User.length,
        }))
      );
    }
  }, [organisationData]);

  return <Tables title="Organisations" tableData={organisationTableData}></Tables>;
}

export default Organisations;
