import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

// Geo URL for US states
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// State Abbreviations Mapping
const stateAbbreviations = {
  al: "Alabama",
  ak: "Alaska",
  az: "Arizona",
  ar: "Arkansas",
  ca: "California",
  co: "Colorado",
  ct: "Connecticut",
  de: "Delaware",
  fl: "Florida",
  ga: "Georgia",
  hi: "Hawaii",
  id: "Idaho",
  il: "Illinois",
  in: "Indiana",
  ia: "Iowa",
  ks: "Kansas",
  ky: "Kentucky",
  la: "Louisiana",
  me: "Maine",
  md: "Maryland",
  ma: "Massachusetts",
  mi: "Michigan",
  mn: "Minnesota",
  ms: "Mississippi",
  mo: "Missouri",
  mt: "Montana",
  ne: "Nebraska",
  nv: "Nevada",
  nh: "New Hampshire",
  nj: "New Jersey",
  nm: "New Mexico",
  ny: "New York",
  nc: "North Carolina",
  nd: "North Dakota",
  oh: "Ohio",
  ok: "Oklahoma",
  or: "Oregon",
  pa: "Pennsylvania",
  ri: "Rhode Island",
  sc: "South Carolina",
  sd: "South Dakota",
  tn: "Tennessee",
  tx: "Texas",
  ut: "Utah",
  vt: "Vermont",
  va: "Virginia",
  wa: "Washington",
  wv: "West Virginia",
  wi: "Wisconsin",
  wy: "Wyoming",
};


const MultiLevelMap = ({ data }) => {
  const [selectedState, setSelectedState] = useState(null);
  const [cities, setCities] = useState([]);
  const [highlightedState, setHighlightedState] = useState(null);

  const handleStateClick = (geo) => {
    const stateName = geo.properties.name;
    const stateData = data.filter(
      (item) => stateAbbreviations[item.PetitionerState] === stateName
    );

    const cityPetitions = stateData.reduce((acc, curr) => {
      const cityName = curr.PetitionerCity.trim().toLowerCase();
      const totalPetitions =
        parseInt(curr.InitialApproval || 0) + parseInt(curr.InitialDenial || 0);

      if (!acc[cityName]) {
        acc[cityName] = {
          city: curr.PetitionerCity,
          total: totalPetitions,
          latitude: parseFloat(curr.Latitude),
          longitude: parseFloat(curr.Longitude),
        };
      } else {
        acc[cityName].total += totalPetitions;
      }

      return acc;
    }, {});

    // Get top 5 cities by petitions
    const sortedCities = Object.values(cityPetitions)
      .filter((city) => city.latitude && city.longitude)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

      console.log({sortedCities})

    setSelectedState(stateName);
    setCities(sortedCities);
    setHighlightedState(stateName);
  };

  return (
    <div>
      <ComposableMap projection="geoAlbersUsa" projectionConfig={{ scale: 1200, center: [125, 29] }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => handleStateClick(geo)}
                style={{
                  default: {
                    fill: highlightedState === geo.properties.name ? "#F53" : "#D6D6DA",
                    stroke: "#FFFFFF",
                    strokeWidth: 0.5,
                    outline: "none",
                  },
                  hover: {
                    fill: "#F53",
                    stroke: "#FFFFFF",
                    strokeWidth: 0.5,
                    outline: "none",
                  },
                  pressed: {
                    fill: "#E42",
                  },
                }}
              />
            ))
          }
        </Geographies>

        {/* City markers */}
        {cities.map((city, index) => (
          <Marker
            key={index}
            coordinates={[city.longitude, city.latitude]}
            onClick={() => console.log(city)}
          >
            <circle r={3} fill="green" /> {/* Reduced marker size */}
            <text
              textAnchor="middle"
              y={-10} 
              style={{ fontSize: 8, fill: "green" }} 
            >
              {city.city} ({city.total})
            </text>
          </Marker>
        ))}
      </ComposableMap>

      {/* State details */}
      {selectedState && (
        <div>
          <h3>Selected State: {selectedState}</h3>
          <h4>Top 5 Cities by Petitions:</h4>
          <ul>
            {cities.map((city, index) => (
              <li key={index}>
                {city.city}: {city.total} petitions
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiLevelMap;
