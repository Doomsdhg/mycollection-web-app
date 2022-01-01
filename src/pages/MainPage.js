import React from 'react';
import Main from '../components/Main.js';
import Header from '../components/Header.js';

function MainPage(props) {
    return (
      <>
        <Header isAuthenticated={props.isAuthenticated}/>
        <Main  />
      </>
    )
}

export default MainPage
