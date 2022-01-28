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
  }

  render() {
    var { isLoaded, data, dataState, zoom, center } = this.state;
    // var map = this.map;
    var test = data.slice(0, 30);
    console.log(test.id);
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
              class="reset-btn"
              onClick={() => {
                window.location.reload();
              }}
            >
              Refresh Page
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
                  <p display="none" key={test.id} id="side-info">
                    Sensor Name: {test.sensorName}
                    <br></br>
                    <button
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

              <LayersControl.Overlay name="Farm 2">
                <LayerGroup>
                  {farm2.map((test) => (
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
