import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {useRoutes} from './routes';
import {Provider} from 'react-redux';
import {store} from './store/store.js';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor} from './store/store.js';
import {useSelector} from 'react-redux';

function App() {
  const userData = useSelector(state => state.userData);
  const routes = useRoutes(userData.isAuthenticated);
  return (
    
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {routes}
          </PersistGate>
        </Provider>
      </BrowserRouter>  
    
  );
}

export default App;
