import React, {useEffect, useState, useMemo} from 'react';
import {useTable, useSortBy} from 'react-table';
import {useSelector} from 'react-redux';
import BTable from 'react-bootstrap/Table';
import { ToastContainer, toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { useDispatch } from 'react-redux';
import {setItemId} from '../store/reducers';

function CollectionTable() {
    const [markdownValue, setMarkdownValue] = useState();
    const [collectionFormValue, setCollectionFormValue] = useState([]);
    const [collectionDataDisabled, setCollectionFormsDisabled] = useState(true);
    const [collectionData, setCollectionData] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
      setItemFormValue({...itemFormValue, 
        collectionRef: userData.collectionId,
        checkboxField1: false,
        checkboxField2: false,
        checkboxField3: false
      });
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
              } , 
              ...response.headers, 
              {
                Header: 'Item page',
                accessor: 'itemRef'
              }])
              setItems(response.items)
          } catch (error) {
            console.log(error);
          }
    }
    
    const table = useTable(
      {columns, data},
      useSortBy);
    
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = table;
      
    const formChangeHandler = function(e){
      if (e.target.name.includes('checkbox')) {
        setItemFormValue({...itemFormValue, [e.target.name]: String(e.target.checked)})
        return null
      }
      setItemFormValue({...itemFormValue, [e.target.name]: String(e.target.value)});
      console.log(itemFormValue)
    }

    const markdownChangeHandler = function(e, formName){
      if (itemFormValue.formName) {
        const newValue = itemFormValue.formName + e;
        setItemFormValue ({...itemFormValue, [formName]: newValue})
      } else {
        setItemFormValue ({...itemFormValue, [formName]: e})
      }
      
    }

    const toggleCollectionDataForms = async function (){
      setCollectionFormsDisabled(prev => !prev)
    }

    useEffect(()=>{
      setCollectionFormValue({...collectionFormValue, description: markdownValue});
      console.log(markdownValue);
      console.log(collectionFormValue);
    },[markdownValue])

    const updateCollectionData = async function (){
      try {
        const request = await fetch('https://mycollection-server.herokuapp.com/api/updatecollection', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({data: {...collectionFormValue, collectionId: userData.collectionId}})
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

    const goToItemPage = function (e) {
      dispatch(setItemId(e.target.dataset.id));
      console.log(userData);
      navigate('/itempage');
    }

    const getFormType = function (string) {
      const formType = string.substring(0, string.length - 1);
      switch (formType) {
        case 'numberField':
          return 'number'
        case 'stringField':
          return 'string'
        case 'textField':
          return 'text'
        case 'checkboxField':
          return 'checkbox'
        case 'dateField':
          return 'date'
      }
    }

    return (
      <>
        <div className='container' style={{'marginTop': '100px'}}> 
          <button type="button" className="btn btn-primary mb-3" onClick={toggleCollectionDataForms}>Edit collection data</button>
          <button type="button" className="btn btn-danger ms-3 mb-3" onClick={deleteCollection}>Delete collection</button>
          <div className="my-3 p-3 bg-body rounded shadow-sm" style={collectionDataDisabled?null:{'display':'none'}}>
            <h1 className="border-bottom pb-2 mb-0">Collection data</h1>
            <div className="d-flex text-muted pt-3">
              

              <p className="pb-3 mb-0 small lh-sm border-bottom">
                <strong className="d-block text-gray-dark">Collection name</strong>
              {collectionData.name}
              </p>
            </div>
            <div className="d-flex text-muted pt-3">
              

              <p className="pb-3 mb-0 small lh-sm border-bottom">
                <strong className="d-block text-gray-dark">Collection description</strong>
                <MDEditor.Markdown 
                  source={markdownValue} 
                />
              </p>
            </div>
            <div className="d-flex text-muted pt-3">
              

              <p className="pb-3 mb-0 small lh-sm border-bottom">
                <strong className="d-block text-gray-dark">Collection topic</strong>
                {collectionData.topic}
              </p>
            </div>
          </div>
          <div className='form-group' style={collectionDataDisabled?{'display':'none'}:null}>
          <h1 className="border-bottom pb-2 mb-0">Collection data</h1>
            <div className="mb-3 mt-3">
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
          </div>
          
          <BTable striped bordered hover size="sm" {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render('Header')}
                      {column.isSorted ? (column.isSortedDesc ? " ▲" : " ▼") : ""}
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
                          <input type='checkbox'/>
                        </td>
                        )
                      } 
                      if (index === headers.length - 1) {
                        return (
                          <td {...cell.getCellProps()}>
                          {cell.render('Cell')}
                          <button type="button" className="btn btn-primary" data-id={row.values._id} onClick={(e)=>{goToItemPage(e)}}>
                            Open</button>
                        </td>
                        )
                      }
                      if (cell.column.fieldType && cell.column.fieldType.includes('text')) {
                        return (
                          <td {...cell.getCellProps()}>
                          <MDEditor.Markdown 
                            source={cell.value} 
                          />
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
          <button type="button" className="btn btn-primary mb-3" onClick={toggleForms}
              style={displayForms?{'display': 'inline', 'backgroundColor': 'grey', 'border': 'none'}
              :{'display': 'inline', 'backgroundColor': '#4CAF50', 'border': 'none'}}>
                {displayForms?'Close console':'Open console of item adding'}</button>
          <div className={displayForms?'wrapper':'display-none'}>
            {headers.map((header, index)=>{
              if (index === 0 || index === 1 || header.Header === 'Item page') return null
              const type = header.fieldType.substring(0, header.fieldType.length - 6);
              
              if (type === 'checkbox') {
                return (
                  <div className="mb-3 form" key={index}>
                    <input type="checkbox" value={false} name={header.fieldType}
                    onChange={formChangeHandler}/>
                    <span className="text ms-3" id="basic-addon1">{header.Header}</span>
                  </div>
                )
              }
              if (type === 'text') {
                return (
                  <div className="mb-3 form" key={index}>
                  <span className="text" id="basic-addon1">{header.Header}</span>
                  <MDEditor
                    value={itemFormValue[header.fieldType]}
                    name={header.fieldType}
                    onChange={(e)=>{markdownChangeHandler(e, header.fieldType)}}
                  />
                  </div>
                )
              }
              return (
            <div className="mb-3 form" key={index}>
              <span className="text" id="basic-addon1">{header.Header}</span>
              <input type={type}
              className="form-control" 
              name={header.fieldType} 
              placeholder={type} 
              onChange={formChangeHandler} />
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
