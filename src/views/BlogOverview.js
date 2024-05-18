import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import SmallStats from "../components/common/SmallStats";
import UsersOverview from "../components/blog/UsersOverview";
import UsersByDevice from "../components/blog/UsersByDevice";
import NewDraft from "../components/blog/NewDraft";
import Discussions from "../components/blog/Discussions";
import TopReferrals from "../components/common/TopReferrals";
import { useQuery } from "@apollo/client";
import {
  USER_DASHBOARD_QUERY,
  ORGANISATION_DASHBOARD_QUERY,
  EVENT_DASHBOARD_QUERY,
  CONTENT_DASHBOARD_QUERY,
} from "../utils/api/graphql/queries";

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

function ParseUserData(title, value, defaultIdx) {
  const stat = defaultStats[defaultIdx];
  stat["value"] = value;
  stat["label"] = title;
  return stat;
}

function BlogOverview() {
  const { loading: userLoading, data: userData } = useQuery(
    USER_DASHBOARD_QUERY,
    {
      variables: {},
      pollInterval: 10000,
    }
  );

  const { loading: organisationLoading, data: organisationData } = useQuery(
    ORGANISATION_DASHBOARD_QUERY,
    {
      variables: {},
      pollInterval: 10000,
    }
  );

  const { loading: eventLoading, data: eventData } = useQuery(
    EVENT_DASHBOARD_QUERY,
    {
      variables: {},
      pollInterval: 10000,
    }
  );

  const { loading: contentLoading, data: contentData } = useQuery(
    CONTENT_DASHBOARD_QUERY,
    {
      variables: {},
      pollInterval: 10000,
    }
  );

  const [smallStats, setStats] = useState([]);

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

  useEffect(() => {
    setStats(setStatData);
  }, [userData, organisationData, contentData, eventData]);

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
          {/* Users Overview */}
          <Col lg="8" md="12" sm="12" className="mb-4">
            <UsersOverview userData={userData?.GetUsers}/>
          </Col>

          {/* Users by Device */}
          <Col lg="4" md="6" sm="12" className="mb-4">
            <UsersByDevice />
          </Col>

          {/* Discussions */}
          <Col lg="5" md="12" sm="12" className="mb-4">
            <Discussions />
          </Col>

          {/* Top Referrals */}
          <Col lg="3" md="12" sm="12" className="mb-4">
            <TopReferrals />
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
