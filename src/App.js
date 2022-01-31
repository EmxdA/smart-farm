import { Component } from "react/cjs/react.production.min";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  LayersControl,
  LayerGroup,
} from "react-leaflet";
import React from "react";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      sensors: [],
      forest1: [],
      forest2: [],
      isLoaded: false,
      dataState: "",
      center: [-37, 144],
      zoom: 6,
      marker: null,
    };
  }

  componentDidMount() {
    fetch("http://3.145.158.103:1880/sensors/list")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          isLoaded: true,
          data: json,
        });
      });
    fetch("http://3.145.158.103:1880/sensors/lastValue")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          isLoaded: true,
          sensors: json,
        });
      });
  }

  render() {
    var { isLoaded, data, dataState, zoom, center, sensors } = this.state;
    // var map = this.map;
    var test = data.slice(0, 30);
    var readings = sensors;
    var farm1 = data.slice(0, 10);
    var farm2 = data.slice(11, 20);
    var farm3 = data.slice(21, 30);

    var dict = {1: "temp", 2: "humidity", 3:"soil moisture", 4: "PH", 5:"C02"}

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
              id="search"
              type="text"
              placeholder="search..."
              onChange={(event) => {
                this.setState({ dataState: event.target.value });
              }}
            />

            <br></br>
            <button
              class="reset-btn"
              onClick={() => {
                this.setState({
                  center: [-37, 144],
                  zoom: 5,
                });
                console.log(center, zoom);
              }}
            >
              Reset Marker
            </button>

            <button
              class="refresh-btn"
              onClick={() => {
                window.location.reload();
              }}
            >
              <ion-icon name="refresh"></ion-icon>
            </button>

            <div id="view">
              {test
                .filter((test) => {
                  if (dataState === "") {
                    return test;
                  } else if (
                    test.sensorName
                      .toLowerCase()
                      .includes(dataState.toLowerCase())
                  ) {
                    return dataState;
                  } else {
                    return null;
                  }
                })
                .map((test) => (
                  <p display="none" key={test.sensor_id} id="side-info">
                    {test.sensorName}
                    <br></br>
                    <button
                      class = "set-btn"
                      onClick={() => {
                        this.setState({
                          center: [
                            Number(test.location.longitude),
                            Number(test.location.latitude),
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
            <LayersControl position="topright" class="map-layer">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <LayersControl.Overlay checked name="Farm 1">
                <LayerGroup>
                  {farm1.map((test) => (
                    <Marker
                      key={test.sensor_id}
                      position={[
                        test.location.longitude,
                        test.location.latitude,
                      ]}
                    >
                      {" "}
                      <Popup class="popup">
                        {readings
                          .filter((readings) => {
                            if (
                              readings.sensor_id
                                .toString()
                                .includes(test.sensor_id.toString())
                            ) {
                              console.log(readings.sensor_id.toString());
                              return readings.sensor_id;
                            }
                            return null;
                          })
                          .map((readings) => (
                            <p key={readings.id}>
                              Type: {dict[readings.sensor_type]} <br></br>
                              Val: {readings.value} <br></br>Time: {readings.time}
                            </p>
                          ))}
                      </Popup>
                    </Marker>
                  ))}
                </LayerGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Farm 2">
                <LayerGroup>
                  {farm2.map((test) => (
                    <Marker
                      key={test.sensor_id}
                      position={[
                        test.location.longitude,
                        test.location.latitude,
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
                        test.location.longitude,
                        test.location.latitude,
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
