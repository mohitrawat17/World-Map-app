import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import img from "./images/marker.png";
import { useEffect, useState } from "react";

const MapBody = () => {
  //state variable for coordinates
  const [coordinates, setCoordinates] = useState({
    lat: 28.439713,
    lng: 77.280578,
  });
  const [info, setInfo] = useState();
  const [text, setText] = useState("");


  // fetching Open cage API
  const getCountries = async () => {
    try {
      const data = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${coordinates.lat}+${coordinates.lng}&key=${process.env.REACT_APP_API}`
      );
      const json = await data.json();

      if (json.results && json.results.length > 0) {
        setInfo(json.results[0]);
        // console.log(json.results[0]);
      } else {
        alert("No data available for the clicked coordinates.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error here, such as showing a user-friendly message
    }
  };

    // fetching Open cage API for search box
  const getCountriesNames = async () => {
    try {
      const dataName = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=URI-ENCODED-${text}&key=${process.env.REACT_APP_API}`
      );
      const jsonName = await dataName.json();

      if (jsonName.results && jsonName.results.length > 0) {
        // console.log(jsonName);
        setInfo(jsonName.results[0]);
        setCoordinates(jsonName.results[0].geometry);
      } else {
        alert("No data available for the clicked coordinates.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Api will call whenever coordinates changes
  useEffect(() => {
    getCountries();
  }, [coordinates]);

  //creating icon for the marker
  const markerIcon = new Icon({
    iconUrl: img,
    iconSize: [40, 40],
  });

  // console.log(info);

  return (
    <div>
      {/*header */}
      <div className="mb-5 flex justify-center">
        <input
          type="text"
          placeholder="Search"
          className="rounded-l-xl border-2 pl-3 outline-none text-lg border-gray-300 w-1/3"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <h3
          className="bg-gray-300 px-3 rounded-r-xl cursor-pointer hover:bg-slate-400"
          onClick={getCountriesNames}
        >
          🔍
        </h3>
      </div>

      <div className="flex justify-between">
        {/* main container of the map ---------------------------------------------------------------- */}
        <MapContainer
          center={[coordinates.lat, coordinates.lng]}
          zoom={5}
          scrollWheelZoom={true}
          className="2xl:h-[50rem] 2xl:w-[75rem] xl:h-[40rem] xl:w-[55rem] lg:h-[35rem] lg:w-[45rem] md:h-[32rem] md:w-[37rem]"
        >
          <TileLayer
            attribution="OpenStreetMap DE"
            url="https://tile.openstreetmap.de/{z}/{x}/{y}.png"
          />

          {/* Attach the 'click' event listener using useMapEvents */}
          <EventHandlingMapEvents onClick={(e) => setCoordinates(e.latlng)} />

          {/* for position of the marker I used custom coordinates of my current location */}
          <Marker
            className="hover:bg-black"
            position={[coordinates.lat, coordinates.lng]}
            icon={markerIcon}
          ></Marker>
        </MapContainer>

        {/* Details ---------------------------------------------------------------- */}
        <div className="p-3 flex-1 ml-8 bg-gray-200 shadow-lg font-semibold">
          <h1 className="text-center font-bold text-3xl pb-2">
            {info?.components?.country}
          </h1>
          {info?.components?.country_code ? (
            <img
              className="pb-2 w-80 mx-auto"
              src={
                "https://flags.fmcdn.net/data/flags/normal/" +
                info?.components?.country_code +
                ".png"
              }
              alt="FLAG"
            />
          ) : (
            <h3>No Flag available</h3>
          )}
          <h2 className="pb-1">State : {info?.components?.state}</h2>
          <h3 className="pb-1">Latitude : {info?.annotations?.DMS?.lat}</h3>
          <h3 className="pb-1">Longitude : {info?.annotations?.DMS?.lng}</h3>
          <h3 className="pb-1">Continent : {info?.components?.continent}</h3>
          <h3 className="pb-1">
            Currency : {info?.annotations?.currency?.name},{" "}
            {info?.annotations?.currency?.iso_code},{" "}
            {info?.annotations?.currency?.symbol}
          </h3>

          <h3 className="pb-1">
            Time zone : {info?.annotations?.timezone?.name}{" "}
            {info?.annotations?.timezone?.offset_string},{" "}
            {info?.annotations?.timezone?.short_name}{" "}
          </h3>
          <h3 className="pb-1">Location : {info?.formatted}</h3>
        </div>
      </div>
    </div>
  );
};

// Custom component for attaching the click event using useMapEvents
const EventHandlingMapEvents = ({ onClick }) => {
  useMapEvents({
    click: (e) => {
      onClick(e);
    },
  });
  return null;
};

export default MapBody;
