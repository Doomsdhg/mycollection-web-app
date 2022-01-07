import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useAuthHooks} from '../hooks/authHooks.js';
import {useNavigate} from 'react-router-dom';


function Header(props) {
  const userData = useSelector(state => state.userData);
  const dispatch = useDispatch();
  const {logout} = useAuthHooks();
  const navigate = useNavigate();
  const clickHandler = function(){
    logout(dispatch);
    navigate('/')
  }
  const navClickHandler = function(){
    const navbar = document.querySelector('#navbar');
    navbar.classList.toggle('display-none');
  };
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
                  <a className="nav-link active" aria-current="page" href="/">Home</a>
                </li>
                {(() => {if (userData.isAuthenticated) {
                    return (
                      <>
                      <li className="nav-item">
                        <a className="nav-link" href="/mycollections">My collections</a>
                      </li>
                      <li className="nav-item" >
                      <button type="button" className="btn btn-secondary" onClick={clickHandler}>Log out</button>
                      </li>
                      </>
                    )
                  } else {
                    return (
                        <>
                        <li className="nav-item">
                          <a className="nav-link" href="/auth"><link href='/auth' />Log in</a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="/signup">Sign up</a>
                        </li>
                        </>
                    )
                  }})()}
              </ul>
              <form className="d-flex">
                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                <button className="btn btn-outline-success" type="submit">Search</button>
              </form>
            </div>
          </div>
        </nav>
            
                  
    )
}

export default Header
