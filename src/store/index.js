import { configureStore } from '@reduxjs/toolkit';

import reducer from '../reducers';

const { NODE_ENV } = process.env;

const store = configureStore({
  reducer,
});

if (
  typeof NODE_ENV !== 'undefined' &&
  NODE_ENV !== 'production' &&
  NODE_ENV !== 'test' &&
  module.hot
) {
  module.hot.accept('../reducers/index.js', () => {
    // eslint-disable-next-line global-require
    const newReducer = require('../reducers').default;
    store.replaceReducer(newReducer);
  });
}

export default store;
