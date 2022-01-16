import React, {useEffect, useState, useMemo} from 'react';
import {useTable} from 'react-table';
import {useSelector} from 'react-redux';
import BTable from 'react-bootstrap/Table';
import { ToastContainer, toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';

function CollectionTable() {
    const [markdownValue, setMarkdownValue] = useState();
    const [collectionFormValue, setCollectionFormValue] = useState([]);
    const [collectionDataDisabled, setCollectionFormsDisabled] = useState(true);
    const [collectionData, setCollectionData] = useState('');
    const navigate = useNavigate();
    const [itemFormValue, setItemFormValue] = useState([]);
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
      setCollectionFormValue({collectionId: userData.collectionId});
      setItemFormValue({...itemFormValue, collectionRef: userData.collectionId});
      fetchCollectionData();
      fetchCollectionTable();
    },[])
    
    const toggleForms = function(){
      setDisplayForms(current => !current)
      console.log(displayForms);

    }

    const fetchCollectionData = async function(){
      try {
        const request = await fetch('https://mycollection-server.herokuapp.com/api/getcollectiondata', 
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
          setCollectionData(response);
          setMarkdownValue(response.description);
      } catch (error) {
        console.log(error);
      }
    }

    const collectionDataChangeHandler = async function(e){
      setCollectionFormValue({...collectionFormValue, [e.target.name]: e.target.value});
      console.log(collectionFormValue)
    }

    const fetchCollectionTable = async function(){
        try {
            const request = await fetch('https://mycollection-server.herokuapp.com/api/getcollectiontable', 
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
              setHeaders([{
                Header: '',
                accessor: 'select'
              } , ...response.headers]);
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
      setItemFormValue({...itemFormValue, [e.target.name]: e.target.value});
      console.log(itemFormValue)
    }

    const toggleCollectionDataForms = async function (){
      setCollectionFormsDisabled(prev => !prev)
    }

    const updateCollectionData = async function (){
      try {
        const request = await fetch('https://mycollection-server.herokuapp.com/api/updatecollection', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({data: collectionFormValue})
        });
        const response = await request.json();
        console.log(response.message);
        fetchCollectionData();
        setTimeout(()=>{
          toast('changes saved successfully!');
        },100)

      } catch (error) {
        console.error(error)
      }
    }

    const deleteCollection = async function(){
      try {
        const request = await fetch('https://mycollection-server.herokuapp.com/api/deletecollection', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({data: {collectionId: userData.collectionId}})
        });
        const response = await request.json();
        console.log(response.message);
        setTimeout(()=>{
          toast('Collection deleted successfully!');
        },100)
        navigate('/mycollections')
      } catch (error) {
        console.error(error)
      }
      
    }

    const uploadItem = async function(){
        console.log(itemFormValue);
        
        try {
          const request = await fetch('https://mycollection-server.herokuapp.com/api/uploaditem', 
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({data: itemFormValue})
          });
          const response = await request.json();
          console.log(response.message);
          setTimeout(()=>{
            toast('item added successfully!');
          },100)
  
        } catch (error) {
          console.error(error)
        }
        fetchCollectionTable()
    }

    return (
      <>
        <div className='container' style={{'marginTop': '100px'}}> 
          <button type="button" className="btn btn-primary mb-3" onClick={toggleCollectionDataForms}>Edit collection data</button>
          <button type="button" className="btn btn-danger ms-3 mb-3" onClick={deleteCollection}>Delete collection</button>
          <div className="mb-3">
            <span className="text" id="basic-addon1">Collection name</span>
            <input type="text" className="form-control" defaultValue={collectionData.name} onChange={collectionDataChangeHandler} 
            name='name' disabled={collectionDataDisabled?true:false} placeholder="My collection" aria-describedby="basic-addon1" />
          </div>
          <div className="">
            <span className="-text">Collection description</span>
            <MDEditor
              value={markdownValue}
              onChange={setMarkdownValue}
              name='description'
            />
            
          </div>
          <div className="container">
            
          </div>
          <div className="mb-3 mt-3">
            <label className="-text" htmlFor="inputGroupSelect01">Topic</label>
            <select className="form-select" onChange={collectionDataChangeHandler} name='topic' 
            disabled={collectionDataDisabled?true:false} id="inputGroupSelect01">
              <option >Choose...</option>
              <option selected={collectionData.topic==='Books'?true:false} value="Books">Books</option>
              <option selected={collectionData.topic==='Alcohol'?true:false} value="Alcohol">Alcohol</option>
              <option selected={collectionData.topic==='Other'?true:false} value="Other">Other</option>
            </select>
          </div>
          <button type="button" className="btn btn-success mb-3" onClick={updateCollectionData}>Save edited collection data</button>
          <button type="button" className="btn btn-success mb-3 ms-3">Cancel collection data changes</button>
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
                    {row.cells.map((cell, index) => {
                      if (index === 0) {
                        return (
                          <td {...cell.getCellProps()}>
                          {cell.render('Cell')}
                          <input type='checkbox' />
                        </td>
                        )
                      } 
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
