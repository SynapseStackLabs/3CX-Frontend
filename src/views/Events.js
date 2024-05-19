import React, { useEffect, useState } from "react";
import { EVENTS_QUERY } from "../utils/api/graphql/queries";
import { useQuery } from "@apollo/client";
import "../App.css";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
  Badge,
  Button,
} from "shards-react";
import PageTitle from "../components/common/PageTitle";

const defaultEventData = {
  backgroundImage: require("../images/content-management/5.jpeg"),
  category: "Travel",
  categoryTheme: "info",
  author: "Anna Ken",
  authorAvatar: require("../images/avatars/0.jpg"),
  title: "Attention he extremity unwilling on otherwise cars backwards yet",
  body: "Conviction up partiality as delightful is discovered. Yet jennings resolved disposed exertion you off. Left did fond drew fat head poor jet pan flying over...",
  date: "29 February 2019",
};

function truncateText(text, maxLength = 150) {
  if (!text) return;
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
}

function Events() {
  const [eventData, setEventData] = useState([defaultEventData]);

  const { data } = useQuery(EVENTS_QUERY, {
    variables: {},
    pollInterval: 10000,
  });

  useEffect(() => {
    if (data?.GetEvents) {
      setEventData(
        data?.GetEvents.map((event) => {
          let cardData = { ...defaultEventData };
          cardData.category = event.event_type;
          cardData.title = event.title;
          cardData.body = event.description;
          const createdDate = new Date(event.created);
          const options = { year: "numeric", month: "long", day: "numeric" };
          cardData.date = createdDate.toLocaleDateString("en-US", options);
          return cardData;
        })
      );
    }
  }, [data]);

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="4"
          title="Events"
          subtitle="Components"
          className="text-sm-left"
        />
      </Row>
      <Row>
        {eventData.map((post, idx) => (
          <Col lg="6" sm="12" className="mb-4" key={idx}>
            <Card
              small
              className="card-post card-post--aside card-post--1"
              style={{ height: 250 }}
            >
              <div
                className="card-post__image"
                style={{ backgroundImage: `url('${post.backgroundImage}')` }}
              >
                <Badge
                  pill
                  className={`card-post__category bg-${post.categoryTheme}`}
                >
                  {post.category}
                </Badge>
                <div className="card-post__author d-flex">
                  <a
                    href="#"
                    className="card-post__author-avatar card-post__author-avatar--small"
                    style={{ backgroundImage: `url('${post.authorAvatar}')` }}
                  >
                    Written by Anna Ken
                  </a>
                </div>
              </div>
              {/* <CardBody>
                <h5 className="card-title">
                  <a className="text-fiord-blue" href="#">
                    {post.title}
                  </a>
                </h5>
                <p className="card-text d-inline-block mb-3">
                  {truncateText(post.body)}
                </p>
                <span className="text-muted">{post.date}</span>
              </CardBody> */}
              <CardBody className="card-body">
                <div className="top-content">
                  <h5 className="card-title">
                    <a className="text-fiord-blue" href="#">
                      {truncateText(post.title, 30)}
                    </a>
                  </h5>
                  <p className="card-text d-inline-block mb-3">
                    {truncateText(post.body)}
                  </p>
                </div>
                <span className="text-muted bottom-span">{post.date}</span>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Events;
