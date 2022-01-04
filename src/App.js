import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {useRoutes} from './routes';
import {Provider} from 'react-redux';
import {store} from './store/store.js';
import {useDispatch} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {persistor} from './store/store.js';

function App() {
  const dispatch = useDispatch();
  const routes = useRoutes(false);
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
