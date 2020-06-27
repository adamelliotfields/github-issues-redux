import { combineReducers } from '@reduxjs/toolkit';

import comments from './comments';
import issues from './issues';
import issuesDisplay from './issues-display';
import repoDetails from './repo-details';

const reducer = combineReducers({
  comments,
  issues,
  issuesDisplay,
  repoDetails,
});

export default reducer;
