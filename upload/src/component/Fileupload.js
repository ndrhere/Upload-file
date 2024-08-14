import React, { useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy, useGlobalFilter } from 'react-table';

function FileUpload() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.length > 0) {
        const cols = Object.keys(response.data[0]).map(key => ({
          Header: key,
          accessor: key,
        }));

        setColumns(cols);
        setData(response.data);
      } else {
        alert('No data found in the uploaded file.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file.');
    }
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setGlobalFilter } = useTable(
    { columns, data },
    useGlobalFilter,
    useSortBy
  );

  return (
    <div>
      <div className="d-flex my-3" style={{justifyContent:"center", alignItems: "center"}}>
      <input className="my-3 " type="file" style={{marginLeft:"25px"}} onChange={handleFileUpload} />
      </div>
      
      {data.length > 0 && (
        <div>
          <input
            class="form-control w-25 m-auto"
            type="text"
            placeholder="Search..."
            onChange={e => setGlobalFilter(e.target.value || undefined)}
          />
          <table style={{margin:"auto", width:"70%", marginTop:"35px", justifyContent:"center"}} {...getTableProps()}>
            <thead >
              {headerGroups.map(headerGroup => (
                <tr  {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                   <th className="px-4 " {...column.getHeaderProps(column.getSortByToggleProps())}>
                   {column.render('Header')}
                   {column.isSorted
                     ? column.isSortedDesc
                       ? ' 🔽'  
                       : ' 🔼'  
                     : ''}
                 </th>
                 
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
