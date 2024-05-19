import { gql } from "@apollo/client";

export const USER_DASHBOARD_QUERY = gql`
  query UserDashboardQuery {
    GetUsers {
      first_name
      last_name
      created
      country
    }
  }
`;

export const ORGANISATION_DASHBOARD_QUERY = gql`
  query OrganisationDashboardQuery {
    GetOrganisations {
      id
      state
    }
  }
`;

export const EVENT_DASHBOARD_QUERY = gql`
  query EventDashboardQuery {
    GetEvents {
      id
      title
      location
      lat
      lon
    }
  }
`;

export const CONTENT_DASHBOARD_QUERY = gql`
  query ContentDashboardQuery {
    GetContent {
      content_type
      title
    }
  }
`;