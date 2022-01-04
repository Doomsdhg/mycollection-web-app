import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useAuthHooks} from '../hooks/authHooks.js';

function Header(props) {
  const userData = useSelector(state => state.userData);
  const dispatch = useDispatch();
  const {logout} = useAuthHooks();
  const clickHandler = function(){
    logout(dispatch);
  }
  console.log(userData);
    return (
        <nav className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark" aria-label="Main navigation">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">MyCollection</a>
            <button className="navbar-toggler p-0 border-0" type="button" id="navbarSideCollapse" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="navbar-collapse offcanvas-collapse" id="navbarsExampleDefault">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/">Home</a>
                </li>
                {(() => {if (userData.isAuthenticated) {
                    return (
                      <>
                      <li className="nav-item">
                        <a className="nav-link" href="/mycollcetions">My collections</a>
                      </li>
                      <li className="nav-item" >
                      <button type="button" class="btn btn-secondary" onClick={clickHandler}>Log out</button>
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
