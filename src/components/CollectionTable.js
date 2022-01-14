import React, {useEffect, useState, useMemo} from 'react';
import {useTable} from 'react-table';
import {useSelector} from 'react-redux';
import BTable from 'react-bootstrap/Table';
import { ToastContainer, toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';

function CollectionTable() {
    const navigate = useNavigate();
    const [formValue, setFormValue] = useState([]);
    const [displayForms, setDisplayForms] = useState(false);
    const [headers, setHeaders] = useState([]);
    const [items, setItems] = useState([]);
    const columns = useMemo(
      () => [...headers],
      [headers]
    )
    const data = useMemo(
      () => [...items],
      [items]
    )
    const userData = useSelector(store => store.userData);
    useEffect(()=>{
      setFormValue({...formValue, collectionRef: userData.collectionId})
      fetchCollection();
    },[])
    
    const toggleForms = function(){
      setDisplayForms(current => !current)
      console.log(displayForms);

    }

    const fetchCollection = async function(){
        try {
            const request = await fetch('https://mycollection-server.herokuapp.com/api/getcollection', 
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({data: {
                  collectionId: userData.collectionId
                }})
              })
              const response = await request.json();
              console.log(response);
              setHeaders(response.headers);
              setItems(response.items)
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
      
    const formChangeHandler = async function(e){
      setFormValue({...formValue, [e.target.name]: e.target.value});
      console.log(formValue)
    }

    const uploadItem = async function(){
        console.log(formValue);
        
        try {
          const request = await fetch('https://mycollection-server.herokuapp.com/api/uploaditem', 
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({data: formValue})
          });
          const response = await request.json();
          console.log(response.message);
          setTimeout(()=>{
            toast('item added successfully!');
          },100)
  
        } catch (error) {
          console.error(error)
        }
        fetchCollection()
    }

    return (
      <>
        <div className='container' style={{'marginTop': '100px'}}> 
          <BTable striped bordered hover size="sm" {...getTableProps()}>
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
            <tbody>
              {rows.map((row, i) => {
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
          </BTable>
          <button type="button" className="btn btn-primary" onClick={toggleForms}
              style={displayForms?{'display': 'inline', 'backgroundColor': 'grey', 'border': 'none'}
              :{'display': 'inline', 'backgroundColor': '#4CAF50', 'border': 'none'}}>
                {displayForms?'x Cancel':'Open console of item adding'}</button>
          <div className={displayForms?'wrapper':'display-none'}>
            {headers.map((header, index)=>{
              if (index === 0) return null
              return (
            <div className="mb-3 form" key={index}>
              <span className="text" id="basic-addon1">{header.Header}</span>
              <input type="text" className="form-control" name={header.fieldType} placeholder="Text" onChange={formChangeHandler} aria-describedby="basic-addon1" />
            </div>
              )
            })}
            <button type="button" className="btn btn-success mb-3" onClick={uploadItem}>Create new item</button>
          </div>
        </div>
      <ToastContainer />
      </>
    )
}

export default CollectionTable
