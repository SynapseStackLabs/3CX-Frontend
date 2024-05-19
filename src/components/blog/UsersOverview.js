import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, CardHeader, CardBody, Button } from "shards-react";

import RangeDatePicker from "../common/RangeDatePicker";
import Chart from "../../utils/chart";

class UsersOverview extends React.Component {
  constructor(props) {
    super(props);

    this.canvasRef = React.createRef();
    this.createdChart = false;
  }

  getUserCountsByMonth(chartData) {
    const userCountsByMonth = new Array(14).fill(0);

    // Iterate over each user data object
    chartData.forEach((user) => {
      // Parse the created date string into a JavaScript Date object
      const createdDate = new Date(user.created);

      // Get the month from the created date
      const month = createdDate.getMonth(); // Month is zero-based

      // Increment the user count for the corresponding month
      userCountsByMonth[month + 1]++;
    });

    return userCountsByMonth;
  }

  componentDidUpdate() {
    if (this.props.chartData) {
      const chartOptions = {
        ...{
          responsive: true,
          legend: {
            position: "top",
          },
          elements: {
            line: {
              // A higher value makes the line look skewed at this ratio.
              tension: 0.3,
            },
            point: {
              radius: 0,
            },
          },
          scales: {
            xAxes: [
              {
                gridLines: false,
                ticks: {
                  callback(tick, index) {
                    // Jump every 7 values on the X axis labels to avoid clutter.
                    return index % 2 !== 0 ? "" : tick;
                  },
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  suggestedMax: 45,
                  callback(tick) {
                    if (tick === 0) {
                      return tick;
                    }
                    // Format the amounts using Ks for thousands.
                    return tick > 999 ? `${(tick / 1000).toFixed(1)}K` : tick;
                  },
                },
              },
            ],
          },
          hover: {
            mode: "nearest",
            intersect: false,
          },
          tooltips: {
            custom: false,
            mode: "nearest",
            intersect: false,
          },
        },
        ...this.props.chartOptions,
      };

      let chartData = JSON.parse(JSON.stringify(defaultChartData));
      if (this.props.chartData) {
        chartData.datasets[0].data = this.getUserCountsByMonth(
          this.props.chartData
        );
      }

      if (!this.createdChart) {
        this.BlogUsersOverview = new Chart(this.canvasRef.current, {
          type: "LineWithLine",
          data: chartData,
          options: chartOptions,
        });
      }

      // They can still be triggered on hover.
      const buoMeta = this.BlogUsersOverview.getDatasetMeta(0);
      buoMeta.data[0]._model.radius = 0;
      buoMeta.data[chartData.datasets[0].data.length - 1]._model.radius = 0;

      // Render the chart.
      this.BlogUsersOverview.render();
      this.createdChart = true;
    }
  }

  render() {
    const { title } = this.props;
    return (
      <Card small className="h-100">
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
        </CardHeader>
        <CardBody className="pt-0">
          <Row className="border-bottom py-2 bg-light">
            <Col sm="6" className="d-flex mb-2 mb-sm-0">
              <RangeDatePicker />
            </Col>
            <Col>
              <Button
                size="sm"
                className="d-flex btn-white ml-auto mr-auto ml-sm-auto mr-sm-0 mt-3 mt-sm-0"
              >
                View Full Report &rarr;
              </Button>
            </Col>
          </Row>
          <canvas
            height="120"
            ref={this.canvasRef}
            style={{ maxWidth: "100% !important" }}
          />
        </CardBody>
      </Card>
    );
  }
}

UsersOverview.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string,
  /**
   * The chart dataset.
   */
  chartData: PropTypes.array,
  /**
   * The Chart.js options.
   */
  chartOptions: PropTypes.object,
};

const defaultChartData = {
  labels: Array.from(new Array(13), (_, i) => (i === 0 ? 1 : i)),
  datasets: [
    {
      label: "Current Year",
      fill: "start",
      data: [0],
      backgroundColor: "rgba(0,123,255,0.1)",
      borderColor: "rgba(0,123,255,1)",
      pointBackgroundColor: "#ffffff",
      pointHoverBackgroundColor: "rgb(0,123,255)",
      borderWidth: 1.5,
      pointRadius: 0,
      pointHoverRadius: 3,
    },
  ],
};

UsersOverview.defaultProps = {
  title: "Users Created",
};

export default UsersOverview;
