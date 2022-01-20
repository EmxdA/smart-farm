import { Component } from "react/cjs/react.production.min";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
  LayersControl,
  LayerGroup,
} from "react-leaflet";
import { Map, popup } from "leaflet";
import React from "react";

import "./App.css";
import { click } from "@testing-library/user-event/dist/click";
// import { DisplayPosition } from "./map";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      forest1: [],
      forest2: [],
      isLoaded: false,
      dataState: "",
      center: [51.505, -0.091],
      zoom: 5,
      marker: null,
    };
  }

  componentDidMount() {
    fetch(
      "https://data.police.uk/api/crimes-street/all-crime?lat=52.629729&lng=-1.131592&date=2019-10"
    )
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          isLoaded: true,
          data: json,
        });
      });
  }

  render() {
    var { isLoaded, data, dataState, marker, zoom, center, forest1, forest2 } =
      this.state;
    // var map = this.map;
    var test = data.slice(0, 30);
    var farm1 = data.slice(0, 10);
    var farm2 = data.slice(11, 20);
    var farm3 = data.slice(21, 30);

    function LocationMarker() {
      const map = useMapEvents({
        click() {
          map.locate();
        },
        locationfound(e) {
          map.flyTo(center, zoom);
        },
      });

      return null;
    }

    if (!isLoaded) {
      return <div>Loading.....</div>;
    } else {
      return (
        <div id="data">
          <div className="App">
            <input
              type="text"
              placeholder="search..."
              onChange={(event) => {
                this.setState({ dataState: event.target.value });
              }}
            />

            <br></br>
            <button
              id="reset-btn"
              onClick={() => {
                this.setState({
                  center: [50, -1],
                  zoom: 5,
                });
                console.log(center, zoom);
              }}
            >
              Reset Marker
            </button>

            <div id="view">
              {test
                .filter((test) => {
                  if (dataState === "") {
                    return test;
                  } else if (
                    test.location.street.name
                      .toLowerCase()
                      .includes(dataState.toLowerCase())
                  ) {
                    return dataState;
                  } else {
                    return null;
                  }
                })
                .map((test) => (
                  <p display="none" key={test.id} id="side-info">
                    ID: {test.id} <br></br>
                    Street Name: {test.location.street.name}
                    <br></br>
                    <button
                      onClick={() => {
                        this.setState({
                          center: [
                            Number(test.location.latitude),
                            Number(test.location.longitude),
                          ],
                          zoom: 18,
                        });
                        console.log(center, zoom);
                      }}
                    >
                      Set Marker
                    </button>
                  </p>
                ))}
            </div>
          </div>
          <MapContainer id="map" center={center} zoom={zoom}>
            <button id="trigger">
              Travel To Set Marker!
              <LocationMarker />
            </button>
            <LayersControl position="topright">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <LayersControl.Overlay name="Farm 1">
                <LayerGroup>
                  {farm1.map((test) => (
                    <Marker
                      key={test.id}
                      position={[
                        test.location.latitude,
                        test.location.longitude,
                      ]}
                    >
                      {" "}
                      <Popup>
                        <p>ID: {test.id}</p>
                        <p>Longitude: {test.location.longitude}</p>
                        <p>Latitude: {test.location.latitude} </p>
                      </Popup>
                    </Marker>
                  ))}
                </LayerGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Farm 2">
                <LayerGroup>
                  {farm2.map((test) => (
                    <Marker
                      key={test.id}
                      position={[
                        test.location.latitude,
                        test.location.longitude,
                      ]}
                    >
                      {" "}
                      <Popup>
                        <p>ID: {test.id}</p>
                        <p>Longitude: {test.location.longitude}</p>
                        <p>Latitude: {test.location.latitude} </p>
                      </Popup>
                    </Marker>
                  ))}
                </LayerGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Farm 3">
                <LayerGroup>
                  {farm3.map((test) => (
                    <Marker
                      key={test.id}
                      position={[
                        test.location.latitude,
                        test.location.longitude,
                      ]}
                    >
                      {" "}
                      <Popup>
                        <p>ID: {test.id}</p>
                        <p>Longitude: {test.location.longitude}</p>
                        <p>Latitude: {test.location.latitude} </p>
                      </Popup>
                    </Marker>
                  ))}
                </LayerGroup>
              </LayersControl.Overlay>
            </LayersControl>
          </MapContainer>
        </div>
      );
    }
  }
}

export default App;
