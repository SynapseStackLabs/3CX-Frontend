import React, { useEffect } from "react";
import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";
import PropTypes from "prop-types";

import PageTitle from "../components/common/PageTitle";

function Tables({ title, tableData }) {
  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title={title} subtitle="" className="text-sm-left" />
      </Row>

      {/* Default Light Table */}
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">Active {title}</h6>
            </CardHeader>
            <CardBody className="p-0 pb-3">
              {tableData.length > 1 && (
                <table className="table mb-0">
                  <thead className="bg-light">
                    <tr>
                      {Object.keys(tableData[0]).map((key) => (
                        <th scope="col" className="border-0">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((user, index) => (
                      <tr key={index}>
                        {Object.values(user).map((value, idx) => (
                          <td key={idx}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

Tables.propTypes = {
  /**
   * The small stats dataset.
   */
  tableData: PropTypes.array
};

Tables.defaultProps = {
  title: "Users",
  tableData: [],
};

export default Tables;
