import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';

const { NODE_ENV } = process.env;

function render() {
  // eslint-disable-next-line global-require
  const App = require('./components/App').default;

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root'),
  );
}

render();

if (
  typeof NODE_ENV !== 'undefined' &&
  NODE_ENV !== 'production' &&
  NODE_ENV !== 'test' &&
  module.hot
) {
  module.hot.accept('./components/App.jsx', render);
}
