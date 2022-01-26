import React, {useState, useEffect, useMemo} from 'react';
import {useTable} from 'react-table';
import BTable from 'react-bootstrap/Table';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {setProfileId} from '../store/reducers';
import {useTableRender} from '../hooks/tableHooks';

function AdminPanel() {
    const {renderAdminTable} = useTableRender();
    const userData = useSelector(state=>state.userData);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [headers, setHeaders] = useState([
        {
            Header: userData.language==='en'?'id':'идентифиактор',
            accessor: 'id'
        },
        {
            Header: userData.language==='en'?'username':'имя',
            accessor: 'username'
        },
        {
            Header: userData.language==='en'?'email':'почта',
            accessor: 'email'
        },
        {
            Header: userData.language==='en'?'actions':'действия',
            accessor: 'useractions'
        }
    ]);
    const columns = useMemo(
        () => [...headers],
        [headers]
      )
    const data = useMemo(
        () => [...users],
        [users]
      )

    const table = useTable(
        {columns, data});
      
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        } = table;

    useEffect(()=>{
        console.log(userData.language);
        fetchUsers();
    },[])

    const fetchUsers = async function(){
        try {
          const request = await fetch('https://mycollection-server.herokuapp.com/api/getuserstable')
          const response = await request.json();
          console.log(response)
          setUsers(response);
        } catch (error) {
          console.log(error);
        }
      }

    const userPageRedirect = function(userId){
        dispatch(setProfileId(userId));
        navigate('/mycollections');
    }

    
    const changeUser = async function(userId, action){
        try {
            const request = await fetch(`https://mycollection-server.herokuapp.com/api/${action}user`, 
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({data: {userId}})
            });
            const response = await request.json();
            console.log(response);
            fetchUsers();
          } catch (error) {
            console.error(error)
          }
    }


    return (<div className='container'>
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
                      console.log();
                      
                      if (index === headers.length - 1) {
                        return (
                            <td {...cell.getCellProps()}>
                                {cell.render('Cell')}
                                <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                                  <button type="button" class="btn btn-danger" onClick={e=>changeUser(row.original.id, 'delete')}>{userData.language==='en'?'delete':'удалить'}</button>
                                  <button type="button" class="btn btn-warning" onClick={e=>{changeUser(row.values.id, 'block')}}>{userData.language==='en'?row.original.blocked?'unblock':'block':row.original.blocked?'разблокировать':'заблокировать'}</button>
                                  <button type="button" class="btn btn-success" 
                                  onClick={e=>changeUser(row.values.id, 'promote')}>{userData.language==='en'?row.original.admin?'demote to regular user':'promote to admin':row.original.admin?'сделать обычным пользователем':'сделать администратором'}</button>
                                  <button type="button" class="btn btn-primary" onClick={e=>userPageRedirect(row.original.id)}>{userData.language==='en'?'open':'открыть'}</button>
                                </div>
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
          {renderAdminTable(table, headers, changeUser, userPageRedirect, userData)}
    </div>);
}

export default AdminPanel;
