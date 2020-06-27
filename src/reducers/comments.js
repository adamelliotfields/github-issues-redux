import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { getComments } from '../services/github';

const commentsAdapter = createEntityAdapter({
  selectId: (comment) => comment.issueId,
});

const initialState = commentsAdapter.getInitialState({
  loading: false,
  error: null,
});

const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async ({ comments_url: commentsUrl, number: issueId }) => {
    const comments = await getComments(commentsUrl);
    return { issueId, comments };
  },
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  extraReducers: {
    [fetchComments.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [fetchComments.fulfilled]: (state, action) => {
      commentsAdapter.setAll(state, [action.payload]);
      state.loading = false;
      state.error = null;
    },
    [fetchComments.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
  },
});

export { fetchComments };

export default commentsSlice.reducer;
