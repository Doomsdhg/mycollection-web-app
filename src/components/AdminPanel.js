import React, {useState, useEffect, useMemo} from 'react';
import {useTable} from 'react-table';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {useTableRender} from '../hooks/tableHooks';
import {useRequestHooks} from '../hooks/serverRequestHooks';
import { toast, ToastContainer } from 'react-toastify';

function AdminPanel() {
    const {sendPostRequest, sendGetRequest} = useRequestHooks();
    const {renderAdminTable} = useTableRender();
    const userData = useSelector(state=>state.userData);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [headers, setHeaders] = useState([
        {
            Header: userData.language==='en'?'id':'идентифиактор',             //initializing headers
            accessor: 'id'
        },
        {
            Header: userData.language==='en'?'name':'имя',
            accessor: 'username'
        },
        {
            Header: userData.language==='en'?'email':'почта',
            accessor: 'email'
        },
        {
            Header: userData.language==='en'?'actions':'управление',
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
      
    useEffect(()=>{
        setHeadersInitial()             //rerender if language changed
        fetchUsers();
    },[userData.language])

    const userPageRedirect = function(userId){
      navigate(`/mycollections?id=${userId}`)
    }

    const setHeadersInitial = function(){
      setHeaders([
        {
            Header: userData.language==='en'?'id':'идентифиактор',               //reinitializing headers
            accessor: 'id'
        },
        {
            Header: userData.language==='en'?'name':'имя',
            accessor: 'username'
        },
        {
            Header: userData.language==='en'?'email':'почта',
            accessor: 'email'
        },
        {
            Header: userData.language==='en'?'actions':'управление',
            accessor: 'useractions'
        }
      ]);
    }

    const fetchUsers = async function(){
        try {
          const {error, response} = await sendGetRequest('getuserstable')                //getting users data for table
          if (error) {
            throw new Error(error)
          }
          setUsers(response);
        } catch (e) {
          toast('' + e)
        }
      }
    
    const interactWithUser = async function(userId, action){
        try {
          const {error} = await sendPostRequest(`${action}user`, 'userId', userId);                //interact with user
          if (error) {
            throw new Error(error)
          }
          fetchUsers();
        } catch (e) {
          toast('' + e)
        }
    }

    return (
    <div className='container main-container'>
      <div className='d-block rounded p-2 mb-2 mobile-tip'>
        <div className='mb-2'>
          <button type="button" class="btn btn-danger">D</button><span> - {userData.language==='en'?'Delete user':'Удалить пользователя'}</span>
        </div>
        <div className='mb-2'>
          <button type="button" class="btn btn-warning">B/U</button><span> - {userData.language==='en'?'Block/Unblock user':'Заблокировать/Разблокировать пользователя'}</span>
        </div>
        <div className='mb-2'>
          <button type="button" class="btn btn-success">▲/▼</button><span> - {userData.language==='en'?'Give/Take admin role':'Дать/Забрать роль администратора'}</span>
        </div>  
        <div>
          <button type="button" class="btn btn-primary">▶</button><span> - {userData.language==='en'?'Go to user`s collections page':'Открыть страницу коллекций пользователя'}</span>
        </div>
      </div>
      {renderAdminTable(table, headers, interactWithUser, userPageRedirect, userData)}
      <ToastContainer />
    </div>);
}

export default AdminPanel;
