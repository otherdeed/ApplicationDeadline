import React from 'react';
import { Provider } from 'react-redux';
import store from './store/index';
import ReactDOM from 'react-dom/client';
import './index.css';
import Global from './Global';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Provider store={store}>
    <Global/>
    </Provider>
  </React.StrictMode>
);
