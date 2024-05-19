import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  ButtonGroup,
  Button,
  Row,
  Col,
} from "shards-react";

const defaultOrganisationData = {
  id: 1,
  date: "3 days ago",
  author: {
    image: require("../../images/avatars/1.jpg"),
    name: "",
    url: "#",
  },
  post: {
    title: "",
    url: "#",
  },
  body: "Well, the way they make shows is, they make one show ...",
};

function parseDiscussionData(discussions) {
  let result = [];
  try {
    let i = 0;
    for (i = 0; i < 3; i++) {
      let data = JSON.parse(JSON.stringify(defaultOrganisationData));
      data.date = `${discussions[i].User.length} Users`;
      data.post.title = discussions[i].name;
      data.body = discussions[i].description;
      result.push(data);
    }
  } catch (e) {}
  return result;
}

function Organisations({ title, organisations }) {
  const [organisationData, setDiscussionData] = useState([]);
  useEffect(() => {
    let data = [...organisations];
    data = parseDiscussionData(
      data.sort((a, b) => b.User.length - a.User.length)
    );
    setDiscussionData(data);
  }, [organisations]);

  return (
    <>
      <Card small className="blog-comments">
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
        </CardHeader>

        <CardBody className="p-0">
          {organisationData.map((discussion, idx) => (
            <div key={idx} className="blog-comments__item d-flex p-3">
              {/* Avatar */}
              <div className="blog-comments__avatar mr-3">
                <img
                  src={discussion.author.image}
                  alt={discussion.author.name}
                />
              </div>

              {/* Content */}
              <div className="blog-comments__content" style={{ width: "100%" }}>
                {/* Content :: Title */}
                <div className="blog-comments__meta text-mutes">
                  <a className="text-secondary" href={discussion.author.url}>
                    {discussion.author.name}
                  </a>{" "}
                  <a className="text-secondary" href={discussion.post.url}>
                    {discussion.post.title}
                  </a>
                  <span className="text-mutes" style={{ float: "right" }}>
                    {discussion.date}
                  </span>
                </div>

                {/* Content :: Body */}
                <p className="m-0 my-1 mb-2 text-muted">{discussion.body}</p>

                {/* Content :: Actions */}
                <div className="blog-comments__actions">
                  <ButtonGroup size="sm">
                    <Button theme="white">
                      <span className="text-success">
                        <i className="material-icons">check</i>
                      </span>{" "}
                      Approve
                    </Button>
                    <Button theme="white">
                      <span className="text-danger">
                        <i className="material-icons">clear</i>
                      </span>{" "}
                      Reject
                    </Button>
                    <Button theme="white">
                      <span className="text-light">
                        <i className="material-icons">more_vert</i>
                      </span>{" "}
                      Edit
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
            </div>
          ))}
        </CardBody>

        <CardFooter className="border-top">
          <Row>
            <Col className="text-center view-report">
              <Button theme="white" type="submit">
                View All Organisations
              </Button>
            </Col>
          </Row>
        </CardFooter>
      </Card>
    </>
  );
}

Organisations.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string,
  /**
   * The discussions dataset.
   */
  organisations: PropTypes.array,
};

Organisations.defaultProps = {
  title: "Organisations",
  organisations: [],
};

export default Organisations;
