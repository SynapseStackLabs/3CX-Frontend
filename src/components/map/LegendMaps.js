import { useEffect, useRef, useState } from "react";
import {
  MapsComponent,
  Inject,
  LayersDirective,
  LayerDirective,
  Legend,
  MapsTooltip,
  MarkersDirective,
  MarkerDirective,
  Marker,
  Zoom,
} from "@syncfusion/ej2-react-maps";
import * as data from "../../data/legend-datasource.json";
import * as worldMap from "../../data/world-map.json";

let datasource = data;
const SAMPLE_CSS = `
    .control-fluid {
		padding: 0px !important;
    }`;
const LegendMaps = ({ legend, events }) => {
  const [eventsMarker, setEventsMarker] = useState([]);
  const [legendHeight, setLegendHeight] = useState("");
  const [legendWidth, setLegendWidth] = useState("");
  const [mode, setMode] = useState("Default");
  const [isEnableToggleLegend, setIsEnableToggleLegend] = useState(false);
  const [orientation, setOrientation] = useState("Horizontal");
  const [position, setPosition] = useState("Top");
  let mapInstance = useRef(null);
  let legendElement = useRef(null);
  let legendPositionElement = useRef(null);
  let colorMappingData = [
    { from: 0.00001, to: 100, color: "rgb(153,174,214)", label: "<100" },
    { from: 100, to: 200, color: "rgb(115,143,199)", label: "100 - 200" },
    { from: 200, to: 300, color: "rgb(77,112,184)", label: "200 - 300" },
    { from: 300, to: 500, color: "rgb(38,82,168)", label: "300 - 500" },
    { from: 500, to: 19000, color: "rgb(0,51,153)", label: ">500" },
    { color: null, label: null },
  ];
  let template =
    '<div id="template" style="width: 140px;opacity: 90%;background: rgba(53, 63, 76, 0.90);box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.40);padding:10px;border: 1px #abb9c6;border-radius: 4px;">' +
    '<div style="font-size:13px;color:#ffffff;font-weight: 500;"><center>${location}</center></div>' +
    '<hr style="margin-top: 2px;margin-bottom:5px;border:0.5px solid #DDDDDD">' +
    '<div><span style="font-size:13px;color:#cccccc">Title : </span><span style="font-size:13px;color:#ffffff;font-weight: 500;">${title}</span></div>';

  const claster = {
    cluster: [
      {
        latitude: 40.5871782,
        location: "Fort Collins, CO",
        longitude: -105.0770113,
        no: 1,
        title: "2024 Cannabis Research Conference",
        city: "New York",
        area: 8683,
        Rank: 1,
      },
    ],
  };

  const legendChange = (args) => {
    mapInstance.current.legendSettings.mode = legendElement.current.value;
    if (legendElement.current.value === "Interactive") {
      if (
        mapInstance.current.legendSettings.orientation === "Horizontal" ||
        mapInstance.current.legendSettings.orientation === "None"
      ) {
        mapInstance.current.legendSettings.height = "10";
        mapInstance.current.legendSettings.width = "";
      } else {
        mapInstance.current.legendSettings.height = "70%";
        mapInstance.current.legendSettings.width = "10";
      }
    } else {
      mapInstance.current.legendSettings.height = "";
      mapInstance.current.legendSettings.width = "";
    }
    mapInstance.current.refresh();
  };
  const legendPositionChange = (args) => {
    mapInstance.current.legendSettings.position =
      legendPositionElement.current.value;
    if (
      legendPositionElement.current.value === "Left" ||
      legendPositionElement.current.value === "Right"
    ) {
      mapInstance.current.legendSettings.orientation = "Vertical";
      if (mapInstance.current.legendSettings.mode === "Interactive") {
        mapInstance.current.legendSettings.height = "70%";
        mapInstance.current.legendSettings.width = "10";
      } else {
        mapInstance.current.legendSettings.height = "";
        mapInstance.current.legendSettings.width = "";
      }
    } else {
      mapInstance.current.legendSettings.orientation = "Horizontal";
      if (mapInstance.current.legendSettings.mode === "Interactive") {
        mapInstance.current.legendSettings.height = "10";
        mapInstance.current.legendSettings.width = "";
      }
    }
    mapInstance.current.refresh();
  };
  const dataChange = (args) => {
    if (args.checked) {
      mapInstance.current.layers[0].shapeSettings.colorMapping[5].color =
        "lightgrey";
      mapInstance.current.layers[0].shapeSettings.colorMapping[5].label =
        "No Data";
    } else {
      mapInstance.current.layers[0].shapeSettings.colorMapping[5].color = null;
      mapInstance.current.layers[0].shapeSettings.colorMapping[5].label = null;
    }
    mapInstance.current.refresh();
  };
  const toggleLegendChange = (args) => {
    mapInstance.current.legendSettings.toggleLegendSettings.enable =
      args.checked;
    mapInstance.current.refresh();
  };
  const onMapsLoad = () => {
    let maps = document.getElementById("maps");
    maps.setAttribute("title", "");
  };
  const load = (args) => {};
  //tslint:disable
  const tooltip = (args) => {
    if (!args.options["data"]) {
      args.cancel = true;
    }
  };

  useEffect(() => {
    setEventsMarker(events);
  }, [events]);

  useEffect(() => {
    mapInstance.current.refresh();
    console.log("refresh", process.env.PUBLIC_URL);
  }, [eventsMarker]);

  return (
    <div className="control-pane">
      <style>{SAMPLE_CSS}</style>
      <div className="col-lg-12 control-section">
        <MapsComponent
          id="maps"
          tooltipRender={tooltip}
          loaded={onMapsLoad}
          load={load}
          useGroupingSeparator={true}
          ref={mapInstance}
          zoomSettings={{
            enable: true,
            mouseWheelZoom: true,
            maxZoom: 100,
            zoomOnClick: true,
          }}
          legendSettings={{
            visible: true,
            position: position,
            height: legendHeight,
            width: legendWidth,
            orientation: orientation,
            mode: mode,
            toggleLegendSettings: { enable: isEnableToggleLegend },
          }}
        >
          <Inject services={[Legend, MapsTooltip, Marker, Zoom]} />
          <LayersDirective>
            <LayerDirective
              shapeData={worldMap}
              shapePropertyPath="name"
              shapeDataPath="name"
              dataSource={legend}
              tooltipSettings={{
                visible: true,
                valuePath: "name",
                format: "${name} : ${density}",
              }}
              shapeSettings={{
                colorValuePath: "density",
                colorMapping: colorMappingData,
              }}
              markerClusterSettings={{
                allowClustering: true,
                shape: "Image",
                height: 40,
                width: 40,
                labelStyle: { color: "white" },
                imageUrl:
                  "https://ej2.syncfusion.com/react/demos/src/maps/images/cluster.svg",
              }}
            >
              <MarkersDirective>
                <MarkerDirective
                  visible={true}
                  dataSource={eventsMarker}
                  shape="Circle"
                  fill="white"
                  width={10}
                  border={{ color: "#285255", width: 2 }}
                  tooltipSettings={{
                    visible: true,
                    valuePath: "no",
                    template: template,
                  }}
                  animationDuration={0}
                />
              </MarkersDirective>
            </LayerDirective>
          </LayersDirective>
        </MapsComponent>
      </div>
    </div>
  );
};

export default LegendMaps;
