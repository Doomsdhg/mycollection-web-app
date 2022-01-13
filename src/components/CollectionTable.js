import React, {useEffect, useState, useMemo} from 'react';
import {useTable} from 'react-table';
import {useSelector} from 'react-redux';

function CollectionTable() {
    const [headers, setHeaders] = useState([]);
    const columns = useMemo(
        () => [...headers],
        [headers]
      )
    const data = useMemo(
      () => [
        {
          id: 'Hello',
          name: 'World',
          tags: 'dasd'
        },
        {
          id: 'Hello',
          name: 'World',
          tags: 'dasd'
        },
        {
          id: 'Hello',
          name: 'World',
          tags: 'dasd'
        },
      ],
      []
    )
    const userData = useSelector(store => store.userData);
    useEffect(()=>{
        fetchCollection();

    },[])
    
    

    const fetchCollection = async function(){
        try {
            const request = await fetch('https://mycollection-server.herokuapp.com/api/getcollection', 
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({data: {
                  collectionId: data.collectionId
                }})
              })
              const response = await request.json();
              console.log(response);
              setHeaders(response);
              console.log(headers)
          } catch (error) {
            console.log(error);
          }
    }
    
    const table = useTable({columns, data});

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = table;
      

    return (
        <div className='container' style={{'marginTop': '100px'}}> 
            <table {...getTableProps()}>
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps()}>
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                  prepareRow(row)
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render('Cell')}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
        </div>
    )
}

export default CollectionTable
