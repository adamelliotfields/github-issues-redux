import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { getIssue, getIssues } from '../services/github';

const issuesAdapter = createEntityAdapter({
  selectId: (issue) => issue.number,
  // We want the IDs (issue numbers) sorted in descending order (newest first).
  sortComparer: (a, b) => b.number - a.number,
});

const initialState = issuesAdapter.getInitialState({
  pageCount: 0,
  pageLinks: {},
  isLoading: false,
  error: null,
});

const fetchIssue = createAsyncThunk('issues/fetchIssue', async ({ org, repo, number }) =>
  getIssue(org, repo, number),
);

const fetchIssues = createAsyncThunk('issues/fetchIssues', async ({ org, repo, page }) =>
  getIssues(org, repo, page),
);

const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  extraReducers: {
    [fetchIssue.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchIssue.fulfilled]: (state, action) => {
      issuesAdapter.upsertOne(state, action.payload);
      state.isLoading = false;
      state.error = null;
    },
    [fetchIssue.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    },
    [fetchIssues.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchIssues.fulfilled]: (state, action) => {
      const { pageCount, issues, pageLinks } = action.payload;

      state.pageCount = pageCount;
      state.pageLinks = pageLinks;
      state.isLoading = false;
      state.error = null;

      issuesAdapter.setAll(state, issues);
    },
    [fetchIssues.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    },
  },
});

export { fetchIssue, fetchIssues };

export default issuesSlice.reducer;
