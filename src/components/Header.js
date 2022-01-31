import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useAuthHooks} from '../hooks/authHooks.js';
import {useNavigate} from 'react-router-dom';
import {setSearchQuery, setProfileId, setLanguage, setTheme} from '../store/reducers';
import {useRequestHooks} from '../hooks/serverRequestHooks';
import { toast } from 'react-toastify';

function Header(props) {
  const userData = useSelector(state => state.userData);
  const dispatch = useDispatch();
  const {logout} = useAuthHooks();
  const navigate = useNavigate();
  const {sendPostRequest} = useRequestHooks();
  const [searchFormValue, setSearchFormValue] = useState('');
  const clickHandler = function(){
    logout(dispatch);
    navigate('/')
  }

  useEffect(()=>{
    if (userData.isAuthenticated) {                                                         //check if user permission changed after each redirect
      checkUserData()
    }
  },[])

  const navClickHandler = function(){
    const navbar = document.querySelector('#navbar');                                        //toggle mobile navbar
    navbar.classList.toggle('display-none');
  };

  const adminPanelRedirect = function(){
    navigate('/adminpage')
  }

  const redirectToSearchResults = function(e){
    e.preventDefault()
    navigate(`/search?query=${searchFormValue}`)
  }

  const myCollectionsRedirect = function(e){
    e.preventDefault(); 
    dispatch(setProfileId(userData.userId))         //if clicked on 'my collections' link, set collection profile id of current user
    navigate(`/mycollections?id=${userData.userId}`)
  }
  
  const changeLanguage = function(){
    userData.language === 'en'?
    dispatch(setLanguage('ru')):
    dispatch(setLanguage('en'))
  }

  const switchTheme = function(){
    dispatch(setTheme(userData.theme==='light'?'dark':'light'));
  }

  const checkUserData = async function () {
    const {response} = await sendPostRequest('checkuserdata', 'userData', userData);
    if (!response) {                                                                                  //if userdata changed since last redirect, log this user out
      logout(dispatch);
      navigate('/');
      setTimeout(()=>{
        toast(userData.language==='en'?'Administrator changed some permissions for your account, we had to log you out':'Администратор поменял права доступа для вашего аккаунта, нам пришлось разлогинить вас')
      },100)
    }
  }

    return (
        <nav className="navbar navbar-expand-lg fixed-top" aria-label="Main navigation">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">MyCollection</a>
            <button className="navbar-toggler p-0 border-0" type="button" 
            id="navbarSideCollapse" aria-label="Toggle navigation" 
            onClick={navClickHandler} onTouchStart={navClickHandler}>
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="navbar-collapse offcanvas-collapse display-none" id="navbar">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/">{userData.language === 'en'?'Home':'Домой'}</a>
                </li>
                {(() => {if (userData.isAuthenticated) {                  //if user is authenticated show him buttons to log out and to redirect to his collections
                    return (
                      <>
                      <li className="nav-item">
                        <a className="nav-link" href='/' onClick={(e)=>myCollectionsRedirect(e)}>{userData.language === 'en'?'My collections':'Мои коллекции'}</a>
                      </li>
                      <li className="nav-item" >
                      <button type="button" className="btn btn-primary" onClick={clickHandler}>{userData.language === 'en'?'Log out':'Выйти'}</button>
                      </li>
                      </>
                    )
                  } else {                                                //if user is not authenticated show him buttons to sign up and login
                    return (
                        <>
                        <li className="nav-item">
                          <a className="nav-link" href="/auth"><link href='/auth' />{userData.language === 'en'?'Log in':'Войти'}</a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="/signup">{userData.language === 'en'?'Sign up':'Зарегистрироваться'}</a>
                        </li>
                        </>
                    )
                  }})()}
                  {userData.admin ?                                               //if user is admin, show him admin panel button
                    <li className="nav-item">
                      <button className="btn btn-warning ms-3 adm" href="/adminpanel" onClick={adminPanelRedirect}>{userData.language === 'en'?'Admin panel':'Панель администратора'}</button>
                    </li>
                    :null
                  }

              </ul>
              <div className='d-flex header-button-group'>
                <button type="button" className="btn btn-success me-3" onClick={()=>{changeLanguage()}}>{userData.language === 'en'?'lang: EN | change' : 'язык: РУ | сменить'}</button>
                <button type='button' className='btn btn-success me-3' onClick={switchTheme}>{userData.language === 'en'?'switch theme':'поменять тему'}</button>
              </div>
              <form className="d-flex">
                
                <input className="form-control me-2" type="search" placeholder={userData.language === 'en'?'Search':'Поиск'} aria-label="Search" 
                onChange={(e)=>{
                  setSearchFormValue(e.target.value)
                  }} />
                <button className="btn btn-success" type="submit" 
                  onClick={redirectToSearchResults}>
                    {userData.language === 'en'?'Search':'Поиск'}</button>
              </form>
            </div>
          </div>
        </nav>
            
                  
    )
}

export default Header
