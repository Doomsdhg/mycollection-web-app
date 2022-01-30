import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {useRoutes} from './routes';
import {Provider} from 'react-redux';
import {store} from './store/store.js';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor} from './store/store.js';
import {useSelector} from 'react-redux';
import {lightTheme, darkTheme, GlobalStyles} from './themes.js';
import styled, {ThemeProvider} from 'styled-components';

const StyledApp = styled.div``;

function App() {
  const userData = useSelector(state => state.userData);
  const routes = useRoutes(userData.isAuthenticated, userData.admin);
  return (
    
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider theme={userData.theme === 'light'?lightTheme:darkTheme}>
              <GlobalStyles />
                {/* <StyledApp> */}
                  {routes}
                {/* </StyledApp> */}
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </BrowserRouter>  
    
  );
}

export default App;
