import React, {useState, useEffect, useMemo} from 'react';
import {useTable} from 'react-table';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {setProfileId} from '../store/reducers';
import {useTableRender} from '../hooks/tableHooks';
import {useRequestHooks} from '../hooks/serverRequestHooks';

function AdminPanel() {
    const {sendPostRequest, sendGetRequest} = useRequestHooks();
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
      
    useEffect(()=>{
        console.log(userData.language);
        fetchUsers();
    },[])

    const userPageRedirect = function(userId){
      dispatch(setProfileId(userId));
      navigate('/mycollections');
    }

    const fetchUsers = async function(){
        try {
          const response = await sendGetRequest('getuserstable')
          setUsers(response);
        } catch (error) {
          console.log(error);
        }
      }
    
    const interactWithUser = async function(userId, action){
        try {
            await sendPostRequest(`${action}user`, 'userId', userId);
            fetchUsers();
          } catch (e) {
            console.error(e)
          }
    }

    return (
    <div className='container main-container'>
      {renderAdminTable(table, headers, interactWithUser, userPageRedirect, userData)}
    </div>);
}

export default AdminPanel;
