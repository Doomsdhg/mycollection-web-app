import React from 'react'

function Header(props) {
    return (
        <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark" aria-label="Main navigation">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">MyCollection</a>
            <button class="navbar-toggler p-0 border-0" type="button" id="navbarSideCollapse" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class="navbar-collapse offcanvas-collapse" id="navbarsExampleDefault">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="/">Home</a>
                </li>
                {(() => {if (props.isAuthenticated) {
                    return (
                      <li class="nav-item">
                        <a class="nav-link" href="/mycollcetions">My collections</a>
                      </li>
                    )
                  } else {
                    return (
                        <>
                        <li class="nav-item">
                          <a class="nav-link" href="/auth">Log in</a>
                        </li>
                        <li class="nav-item">
                          <a class="nav-link" href="/signup">Sign up</a>
                        </li>
                        </>
                    )
                  }})()}
                
              </ul>
              <form class="d-flex">
                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                <button class="btn btn-outline-success" type="submit">Search</button>
              </form>
            </div>
          </div>
        </nav>
            
                  
    )
}

export default Header
