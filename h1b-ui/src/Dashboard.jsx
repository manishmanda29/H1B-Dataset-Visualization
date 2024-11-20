import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY; // Your Google API Key
const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID; // Spreadsheet ID
const SHEET_NAME = process.env.REACT_APP_SHEET_NAME; // Sheet name

const Dashboard = () => {
  const [rows, setRows] = useState([]);
  const columns = [
    { headerName: 'index', field: 'index',},
    { headerName: 'Continuing Approval', field: 'Continuing Approval', editable: true },
    { headerName: 'Continuing Denial', field: 'Continuing Denial', editable: true },
    { headerName: 'Employer (Petitioner) Name', field: 'Employer (Petitioner) Name', editable: true },
    { headerName: 'Fiscal Year', field: 'Fiscal Year', editable: true },
    { headerName: 'Industry (NAICS) Code', field: 'Industry (NAICS) Code', editable: true },
    { headerName: 'Initial Approval', field: 'Initial Approval', editable: true },
    { headerName: 'Initial Denial', field: 'Initial Denial', editable: true },
    { headerName: 'Line by line', field: 'Line by line', editable: true },
    { headerName: 'Petitioner City', field: 'Petitioner City', editable: true },
    { headerName: 'Petitioner State', field: 'Petitioner State', editable: true },
    { headerName: 'Petitioner Zip Code', field: 'Petitioner Zip Code', editable: true },
    { headerName: 'Tax ID', field: 'Tax ID', editable: true },
  ];

  useEffect(() => {
    fetchSpreadsheetData();
  }, []);
  useEffect(()=>{
console.log("i am heree",rows)
  },[rows])

  const fetchSpreadsheetData = async () => {
    try {
      const url = `https://sheetdb.io/api/v1/ym45zzvwbnk1z`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
        setRows(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCellEdit = async (params) => {
    const updatedRow = params.data;
    console.log('Cell edited:', updatedRow);
    updateSpreadsheet(updatedRow);
  };

  const updateSpreadsheet = async (updatedRow) => {
    try {
      // Construct the URL dynamically with the index of the row
      const url = `https://sheetdb.io/api/v1/ym45zzvwbnk1z/index/${updatedRow?.index}`;
  
      // Prepare the body of the PATCH request in the format expected by SheetDB.io
      const body = {
        data: updatedRow, // Pass the updatedRow directly, as it is already an object
      };
  
      // Make the PATCH request to update the row
      const response = await fetch(url, {
        method: 'PATCH', // Use uppercase PATCH for HTTP method
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
  
      if (response.ok) {
        const responseData = await response.json(); // Parse the JSON response
        console.log('Row updated successfully:', responseData);
      } else {
        const errorText = await response.text(); // Fetch the error message
        console.error('Failed to update row:', errorText);
      }
    } catch (error) {
      console.error('Error updating spreadsheet:', error);
    }
  };
  
  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <AgGridReact
        columnDefs={columns}
        rowData={rows}
        pagination={true}
        domLayout="autoHeight"
        onCellValueChanged={handleCellEdit}
      />
    </div>
  );
};

export default Dashboard;
