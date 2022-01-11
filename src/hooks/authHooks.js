import {useDispatch, useSelector} from 'react-redux';
import {setUserData, deleteUserData} from '../store/reducers';
import React from 'react';

export const useAuthHooks = () => {

  
  const storageName = 'userData';
  
  
  const login = (data, dispatch) => {
    if (data.token && data.userId) {
      localStorage.setItem(storageName, JSON.stringify({
        userId: data.userId, 
        jwt: data.token,
        email: data.email
      }))
      dispatch(setUserData(data));
    }
    

  }

  const logout = (dispatch) => {
    localStorage.removeItem(storageName);
    dispatch(deleteUserData())
  }


  return {login, logout}
}