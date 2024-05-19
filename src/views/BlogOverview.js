import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Card, CardBody } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import SmallStats from "../components/common/SmallStats";
import UsersOverview from "../components/blog/UsersOverview";
import Organisations from "../components/blog/Organisations";
import TopReferrals from "../components/common/TopReferrals";
import { useQuery } from "@apollo/client";
import {
  USER_DASHBOARD_QUERY,
  ORGANISATION_DASHBOARD_QUERY,
  EVENT_DASHBOARD_QUERY,
  CONTENT_DASHBOARD_QUERY,
} from "../utils/api/graphql/queries";
import LegendMaps from "../components/map/LegendMaps";
import getCountries from "../data/country";

const defaultStats = [
  {
    label: "Posts",
    value: "2,390",
    percentage: "4.7%",
    increase: true,
    chartLabels: [null, null, null, null, null, null, null],
    attrs: { md: "6", sm: "6" },
    datasets: [
      {
        label: "Today",
        fill: "start",
        borderWidth: 1.5,
        backgroundColor: "rgba(0, 184, 216, 0.1)",
        borderColor: "rgb(0, 184, 216)",
        data: [1, 2, 1, 3, 5, 4, 7],
      },
    ],
  },
  {
    label: "Pages",
    value: "182",
    percentage: "12.4",
    increase: true,
    chartLabels: [null, null, null, null, null, null, null],
    attrs: { md: "6", sm: "6" },
    datasets: [
      {
        label: "Today",
        fill: "start",
        borderWidth: 1.5,
        backgroundColor: "rgba(23,198,113,0.1)",
        borderColor: "rgb(23,198,113)",
        data: [1, 2, 3, 3, 3, 4, 4],
      },
    ],
  },
  {
    label: "Comments",
    value: "8,147",
    percentage: "3.8%",
    increase: false,
    decrease: true,
    chartLabels: [null, null, null, null, null, null, null],
    attrs: { md: "4", sm: "6" },
    datasets: [
      {
        label: "Today",
        fill: "start",
        borderWidth: 1.5,
        backgroundColor: "rgba(255,180,0,0.1)",
        borderColor: "rgb(255,180,0)",
        data: [2, 3, 3, 3, 4, 3, 3],
      },
    ],
  },
  {
    label: "New Customers",
    value: "29",
    percentage: "2.71%",
    increase: false,
    decrease: true,
    chartLabels: [null, null, null, null, null, null, null],
    attrs: { md: "4", sm: "6" },
    datasets: [
      {
        label: "Today",
        fill: "start",
        borderWidth: 1.5,
        backgroundColor: "rgba(255,65,105,0.1)",
        borderColor: "rgb(255,65,105)",
        data: [1, 7, 1, 3, 1, 4, 8],
      },
    ],
  },
  {
    label: "Subscribers",
    value: "17,281",
    percentage: "2.4%",
    increase: false,
    decrease: true,
    chartLabels: [null, null, null, null, null, null, null],
    attrs: { md: "4", sm: "6" },
    datasets: [
      {
        label: "Today",
        fill: "start",
        borderWidth: 1.5,
        backgroundColor: "rgb(0,123,255,0.1)",
        borderColor: "rgb(0,123,255)",
        data: [3, 2, 3, 2, 4, 5, 4],
      },
    ],
  },
];

const countryCodes = getCountries().reduce((obj, item) => {
  obj[item.name] = item.code;
  return obj;
}, {});

function ParseUserData(title, value, defaultIdx) {
  const stat = JSON.parse(JSON.stringify(defaultStats[defaultIdx]));
  stat["value"] = value;
  stat["label"] = title;
  return stat;
}

function ParseRecommendorData(userData) {
  return {
    title: `${userData.first_name} ${userData.last_name}`,
    value: userData.createdRecommendations.length,
  };
}

function BlogOverview() {
  const { data: userData } = useQuery(USER_DASHBOARD_QUERY, {
    variables: {},
    pollInterval: 10000,
  });

  const { data: organisationData } = useQuery(ORGANISATION_DASHBOARD_QUERY, {
    variables: {},
    pollInterval: 10000,
  });

  const { data: eventData } = useQuery(EVENT_DASHBOARD_QUERY, {
    variables: {},
    pollInterval: 10000,
  });

  const { data: contentData } = useQuery(CONTENT_DASHBOARD_QUERY, {
    variables: {},
    pollInterval: 10000,
  });

  const [smallStats, setStats] = useState([]);
  const [countryUsers, setCountryUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [recommendorData, setRecommendors] = useState([]);

  const setStatData = () => {
    let stats = [];
    if (userData?.GetUsers) {
      stats.push(ParseUserData("Users", userData?.GetUsers.length, 0));
    }
    if (organisationData?.GetOrganisations) {
      stats.push(
        ParseUserData(
          "Organisations",
          organisationData?.GetOrganisations.length,
          1
        )
      );
    }
    if (eventData?.GetEvents) {
      stats.push(ParseUserData("Events", eventData?.GetEvents.length, 2));
    }
    if (contentData?.GetContent) {
      stats.push(ParseUserData("Contents", contentData?.GetContent.length, 3));
    }
    return stats;
  };

  const setCountryUsersData = () => {
    let data = [];
    if (userData?.GetUsers) {
      data = userData?.GetUsers.reduce((obj, item) => {
        const countData = obj.find(
          (val) => val.code == countryCodes[item.country]
        );
        if (countData) {
          countData.value++;
          countData.density++;
          countData.population++;
        } else {
          obj.push({
            code: countryCodes[item.country],
            value: 1,
            name: item.country,
            population: 1,
            density: 1,
          });
        }
        return obj;
      }, []);
      console.log("users", data);
    }
    return data;
  };

  const setEventsData = () => {
    if (eventData?.GetEvents) {
      let index = 1;
      const data = eventData?.GetEvents.map((event) => {
        return {
          latitude: event.lat,
          longitude: event.lon,
          location: event.location,
          title: event.title,
          no: index++,
        };
      });
      return data.filter((e) => e.latitude && e.longitude);
    }
    return [];
  };
  function setRecommendorData() {
    let result = [];
    if (userData?.GetUsers) {
      let users = [...userData?.GetUsers];
      users = users.sort(
        (a, b) =>
          b.createdRecommendations.length - a.createdRecommendations.length
      );
      for (let i = 0; i < 10; i++) {
        result.push(ParseRecommendorData(users[i]));
      }
    }
    return result;
  }

  useEffect(() => {
    setStats(setStatData());
  }, [userData, organisationData, contentData, eventData]);

  useEffect(() => {
    setRecommendors(setRecommendorData());
    setCountryUsers(setCountryUsersData);
  }, [userData]);

  useEffect(() => {
    setEvents(setEventsData);
  }, [eventData]);

  return (
    <>
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle
            title="Report"
            subtitle="Dashboard"
            className="text-sm-left mb-3"
          />
        </Row>

        {/* Small Stats Blocks */}
        <Row>
          {smallStats &&
            smallStats.map((stats, idx) => (
              <Col className="col-lg mb-4" key={idx} {...stats.attrs}>
                <SmallStats
                  id={`small-stats-${idx}`}
                  variation="1"
                  chartData={stats.datasets}
                  chartLabels={stats.chartLabels}
                  label={stats.label}
                  value={stats.value}
                  percentage={stats.percentage}
                  increase={stats.increase}
                  decrease={stats.decrease}
                />
              </Col>
            ))}
        </Row>

        <Row>
          <Col lg="12" md="12" sm="12" className="mb-4">
            <Card small className="h-100">
              <CardBody className="pt-0">
                <LegendMaps legend={countryUsers} events={events} />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          {/* Users Overview */}
          <Col lg="6" md="12" sm="12" className="mb-4">
            <UsersOverview title="Users" chartData={userData?.GetUsers} />
          </Col>

          {/* Users Overview */}
          <Col lg="6" md="12" sm="12" className="mb-4">
            <UsersOverview
              title="Organisations"
              chartData={organisationData?.GetOrganisations}
            />
          </Col>

          {/* Discussions */}
          <Col lg="6" md="12" sm="12" className="mb-4">
            <Organisations organisations={organisationData?.GetOrganisations} />
          </Col>

          {/* Top Referrals */}
          <Col lg="6" md="12" sm="12" className="mb-4">
            <TopReferrals referralData={recommendorData} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

BlogOverview.propTypes = {
  /**
   * The small stats dataset.
   */
  smallStats: PropTypes.array,
};

export default BlogOverview;
