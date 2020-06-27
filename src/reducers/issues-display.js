import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // We need a project with a lot of open issues to demonstrate pagination.
  org: 'facebook',
  repo: 'react',
  page: 1,
  displayType: 'issues',
  issueId: null,
};

const issuesDisplaySlice = createSlice({
  name: 'issuesDisplay',
  initialState,
  reducers: {
    displayRepo: (state, action) => {
      const { org, repo } = action.payload;
      state.org = org;
      state.repo = repo;
    },
    setCurrentPage: (state, action) => {
      state.page = action.payload;
    },
    setCurrentDisplayType: (state, action) => {
      const { displayType, issueId = null } = action.payload;
      state.displayType = displayType;
      state.issueId = issueId;
    },
  },
});

export const { displayRepo, setCurrentDisplayType, setCurrentPage } = issuesDisplaySlice.actions;

export default issuesDisplaySlice.reducer;
