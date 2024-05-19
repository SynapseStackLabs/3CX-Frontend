import { gql } from "@apollo/client";

export const USER_DASHBOARD_QUERY = gql`
  query UserDashboardQuery {
    GetUsers {
      first_name
      last_name
      createdRecommendations {
        id
      }
      created
      country
    }
  }
`;

export const USERS_QUERY = gql`
  query UsersQuery {
    GetUsers {
      first_name
      last_name
      gender
      email
      country
      state
      city
      createdRecommendations {
        id
      }
      created
    }
  }
`;

export const ORGANISATION_DASHBOARD_QUERY = gql`
  query OrganisationDashboardQuery {
    GetOrganisations {
      id
      state
      industry
      description
      name
      User {
        id
      }
      created
    }
  }
`;

export const ORGANISATIONS_QUERY = gql`
  query OrganisationDashboardQuery {
    GetOrganisations {
      city
      country
      description
      industry
      name
      User {
        id
      }
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

export const EVENTS_QUERY = gql`
  query EventDashboardQuery {
    GetEvents {
      created
      description
      event_type
      title
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
