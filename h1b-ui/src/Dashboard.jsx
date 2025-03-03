import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LZString from 'lz-string';

const Dashboard = () => {
  const [rows, setRows] = useState([]);
  const [gridApi, setGridApi] = useState(null);

  const columns = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 50,
      sortable: false,
      filter: false,
    },
    { headerName: 'index', field: 'index' },
    { headerName: 'Industry (NAICS) Code', field: 'Industry (NAICS) Code', editable: true },
    { headerName: 'Tax ID', field: 'Tax ID', editable: true },
    { headerName: 'Employer (Petitioner) Name', field: 'Employer (Petitioner) Name', editable: true },
    { headerName: 'Continuing Approval', field: 'Continuing Approval', editable: true },
    { headerName: 'Continuing Denial', field: 'Continuing Denial', editable: true },
    { headerName: 'Initial Approval', field: 'Initial Approval', editable: true },
    { headerName: 'Initial Denial', field: 'Initial Denial', editable: true },
    { headerName: 'Petitioner City', field: 'Petitioner City', editable: true },
    { headerName: 'Petitioner State', field: 'Petitioner State', editable: true },
    { headerName: 'Petitioner Zip Code', field: 'Petitioner Zip Code', editable: true },
    { headerName: 'Latitude', field: 'Latitude', editable: true },
    { headerName: 'Longitude', field: 'Longitude', editable: true },
   
  ];

  useEffect(() => {
    fetchSpreadsheetData();
  }, []);

  const fetchSpreadsheetData = async () => {
    console.log("i am i  fetchingg")
    try {
      let storage=JSON.parse(LZString.decompress(window.localStorage.getItem("data")));
      console.log(storage);
      if(storage)
      {
        console.log("i am in if")
        setRows(storage)
      }
      else{
      const url = process.env.URL;
      const response = await fetch(url);
      const data = await response.json();
      setRows(data);
      let stringify=LZString.compress(JSON.stringify(data))
      window.localStorage.setItem("data",stringify)
      }
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
      const url = `${process.env.URL}/index/${updatedRow?.index}`;
      const body = {
        data: updatedRow,
      };

      const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Row updated successfully:', responseData);
      } else {
        const errorText = await response.text();
        console.error('Failed to update row:', errorText);
      }
    } catch (error) {
      console.error('Error updating spreadsheet:', error);
    }
  };

  const addNewRow = () => {
    const newIndex = rows.length + 1; // Generate a new index
    const newRow = {
      index: newIndex,
      'Continuing Approval': '',
      'Continuing Denial': '',
      'Employer (Petitioner) Name': '',
      'Fiscal Year': '',
      'Industry (NAICS) Code': '',
      'Initial Approval': '',
      'Initial Denial': '',
      'Line by line': '',
      'Petitioner City': '',
      'Petitioner State': '',
      'Petitioner Zip Code': '',
      'Tax ID': '',
    };

    setRows([...rows, newRow]);
  };

  const deleteSelectedRows = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedRows = selectedNodes.map((node) => node.data);

    const updatedRows = rows.filter(
      (row) => !selectedRows.some((selected) => selected.index === row.index)
    );
    setRows(updatedRows);

    selectedRows.forEach((row) => deleteSpreadsheetRow(row.index));
  };

  const deleteSpreadsheetRow = async (index) => {
    try {
      const url = `${process.env.URL}/index/${index}`;
      const response = await fetch(url, { method: 'DELETE' });
      if (response.ok) {
        console.log(`Row with index ${index} deleted successfully`);
      } else {
        console.error('Error deleting row');
      }
    } catch (error) {
      console.error('Error deleting row:', error);
    }
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  return (
    <div>
      <div style={{ margin: '10px', display: 'flex', gap: '10px' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={addNewRow}
        >
          Add Row
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<DeleteIcon />}
          onClick={deleteSelectedRows}
        >
          Delete Selected Rows
        </Button>
      </div>
      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          columnDefs={columns}
          rowData={rows}
          rowSelection="multiple"
          pagination={true}
          domLayout="autoHeight"
          onCellValueChanged={handleCellEdit}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

export default Dashboard;
