import React, {useState, useEffect, useMemo} from 'react';
import {useTable} from 'react-table';
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
      
    useEffect(()=>{
        console.log(userData.language);
        fetchUsers();
    },[])

    const fetchUsers = async function(){
        try {
          const request = await fetch('https://mycollection-server.herokuapp.com/api/getuserstable')
          const response = await request.json();
          setUsers(response);
        } catch (error) {
          console.log(error);
        }
      }

    const userPageRedirect = function(userId){
        dispatch(setProfileId(userId));
        navigate('/mycollections');
    }

    const getPostRequestOptions = function (dataName, data){
      return (
        {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({data: {[dataName]: data}})
            }
      )
    }
    
    const changeUser = async function(userId, action){
        try {
            const request = await fetch(`https://mycollection-server.herokuapp.com/api/${action}user`, getPostRequestOptions('userId', userId));
            const response = await request.json();
            fetchUsers();
          } catch (error) {
            console.error(error)
          }
    }


    return (
    <div className='container main-container'>
      {renderAdminTable(table, headers, changeUser, userPageRedirect, userData)}
    </div>);
}

export default AdminPanel;
