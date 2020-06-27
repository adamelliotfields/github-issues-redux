import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getRepoDetails } from '../services/github';

const initialState = {
  openIssuesCount: -1,
  error: null,
};

const fetchRepoDetails = createAsyncThunk('repoDetails/fetchRepoDetails', async ({ org, repo }) => {
  return getRepoDetails(org, repo);
});

const repoDetailsSlice = createSlice({
  name: 'repoDetails',
  initialState,
  extraReducers: {
    [fetchRepoDetails.fulfilled]: (state, action) => {
      state.openIssuesCount = action.payload.open_issues_count;
      state.error = null;
    },
    [fetchRepoDetails.rejected]: (state, action) => {
      state.openIssuesCount = -1;
      state.error = action.payload;
    },
  },
});

export { fetchRepoDetails };

export default repoDetailsSlice.reducer;
