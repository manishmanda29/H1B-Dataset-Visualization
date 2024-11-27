import React, { useEffect, useState } from "react";
import PetitionChart from "./components/PetitionChart";
import LZString from 'lz-string';
import MultiLevelMap from "./components/MultiLevelMap";
import CompanyBasedPetitions from "./components/CompanyBasedPetitions";

const Visualizations=()=>{
    console.log("i am heree")
    const [data,setData]=useState([]);

    useEffect(()=>{
fetchSpreadsheetData();
    },[])
    useEffect(()=>{
console.log(data,"dataaaa")
    },data)
    const fetchSpreadsheetData = async () => {
        console.log("i am i  fetchingg")
        try {
          if(window.localStorage.getItem("data"))
          {
          let storage=JSON.parse(LZString.decompress(window.localStorage.getItem("data")));
          console.log(storage);
          if(storage)
          {
            console.log("i am in if")
            setData(storage)
          }
        }
          else{
          const url = "https://sheetdb.io/api/v1/c10t6t6he1p2p";
          console.log(url)
          const response = await fetch(url);
          const data = await response.json();
          setData(data);
          let stringify=LZString.compress(JSON.stringify(data))
          window.localStorage.setItem("data",stringify)
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

    return(
      <>
        <PetitionChart data={data}/>
        <CompanyBasedPetitions data={data}/>
        <MultiLevelMap data={data}/>
        </>
    )

}
export default Visualizations