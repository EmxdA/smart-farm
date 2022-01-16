import { Component } from "react/cjs/react.production.min";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "./App.css"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoaded: false,
      dataState: "",
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
    var { isLoaded, data, dataState } = this.state;
    var test = data.slice(0, 30);

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
                this.setState({ dataState: event.target.value});
              }}
            />
            <div id="view">
              {test.filter((test) => {
                  if (dataState === "") {
                    return test;
                  } else if (test.location.street.name.toLowerCase().includes(dataState.toLowerCase())) {
                    return dataState;
                  } else {
                    return null;
                  }
                })
                .map((test) => (
                  <p display="none" key={test.id}>
                    ID: {test.id} <br></br>
                    Street Name: {test.location.street.name}
                    <br></br>
                    <button>View</button>
                  </p>
                ))}
          </div>
          </div>
          <MapContainer id="map" center={[51.505, -0.09]} zoom={5}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {test.map((test) => (
              <Marker
                key={test.id}
                position={[test.location.latitude, test.location.longitude]}
              >
                {" "}
                <Popup>
                  <p>ID: {test.id}</p>
                  <p>Longitude: {test.location.longitude}</p>
                  <p>Latitude: {test.location.latitude} </p>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      );
    }
  }
}

export default App;
