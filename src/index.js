import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import configureStore from './store/configureStore';

const store = configureStore()
console.log(store.getState())

store.subscribe(() => {
  console.log(store.getState())
})



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);