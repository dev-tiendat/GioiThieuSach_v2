import React from 'react';
import {Provider} from 'react-redux/';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './redux/store';
import Navigator from './navigation/Navigator';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
          <Navigator />
      </PersistGate>
    </Provider>
  );
};

export default App;
