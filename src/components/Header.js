import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useAuthHooks} from '../hooks/authHooks.js';
import {useNavigate} from 'react-router-dom';
import {setSearchQuery, setProfileId, setLanguage} from '../store/reducers';
import themeSwitcher from 'theme-switcher';

function Header(props) {
  const userData = useSelector(state => state.userData);
  const dispatch = useDispatch();
  const {logout} = useAuthHooks();
  const navigate = useNavigate();
  const [searchFormValue, setSearchFormValue] = useState('');
  const clickHandler = function(){
    logout(dispatch);
    navigate('/')
  }
  const { switcher, getTheme } = themeSwitcher({
    themeMap: {
      dark: '../../node_modules/bootstrap/dist/css/bootstrap-dark.css',
      light: '../../node_modules/bootstrap/dist/css/bootstrap.css',
    }
  });
  const navClickHandler = function(){
    const navbar = document.querySelector('#navbar');
    navbar.classList.toggle('display-none');
  };
  const adminPanelRedirect = function(){
    navigate('/adminpage')
  }

  const myCollectionsRedirect = function(){
    dispatch(setProfileId(userData.userId))
  }
  
  const changeLanguage = function(){
    userData.language === 'en'?
    dispatch(setLanguage('ru')):
    dispatch(setLanguage('en'))
  }

  const switchTheme = function(){
    const currentTheme = getTheme();
    if (currentTheme === 'light') {
      switcher({
        theme: 'dark',
      });
    } else {
      switcher({
        theme: 'light',
      });
    }
    console.log(getTheme());
  }

    return (
        <nav className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark" aria-label="Main navigation">
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
                {(() => {if (userData.isAuthenticated) {
                    return (
                      <>
                      <li className="nav-item">
                        <a className="nav-link" href='/mycollections' onClick={myCollectionsRedirect}>{userData.language === 'en'?'My collections':'Мои коллекции'}</a>
                      </li>
                      <li className="nav-item" >
                      <button type="button" className="btn btn-secondary" onClick={clickHandler}>{userData.language === 'en'?'Log out':'Выйти'}</button>
                      </li>
                      </>
                    )
                  } else {
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
                  {userData.admin ? 
                    <li className="nav-item">
                      <button className="btn btn-warning ms-3 adm" href="/adminpanel" onClick={adminPanelRedirect}>{userData.language === 'en'?'Admin panel':'Панель администратора'}</button>
                    </li>
                    :null
                  }
                  <li className="nav-item" >
                    <button type="button" className="btn btn-success ms-3" onClick={()=>{changeLanguage()}}>{userData.language === 'en'?'lang: EN | change' : 'язык: РУ | сменить'}</button>
                  </li>
              </ul>
              <button type='button' className='btn btn-success me-3' onClick={switchTheme}>{userData.language === 'en'?'switch theme':'поменять тему'}</button>
              <form className="d-flex">
                
                <input className="form-control me-2" type="search" placeholder={userData.language === 'en'?'Search':'Поиск'} aria-label="Search" 
                onChange={(e)=>{
                  setSearchFormValue(e.target.value)
                  }} />
                <button className="btn btn-outline-success" type="submit" 
                  onClick={(e)=>{
                  dispatch(setSearchQuery(searchFormValue));
                  navigate('/search')
                  }}>{userData.language === 'en'?'Search':'Поиск'}</button>
              </form>
            </div>
          </div>
        </nav>
            
                  
    )
}

export default Header
