# `redux-toolkit-tutorial`

This is the GitHub Issues app from the Redux Toolkit advanced tutorial.

I'm leaving this up as a future reference for myself, but if you stumble upon it and have a question
or suggestion, feel free to reach out to me via issues or email!

## Environment Variables

This app uses the GitHub API (read-only). While a GitHub API token is not required, you'll get rate
limited after 60 requests without one. Put your GitHub API token in `.env.local`. This file is
Git-ignored, so you don't have to worry about accidentally checking it in.

Note that you must prefix all custom environment variables with `REACT_APP_` when using Create React
App.

```
REACT_APP_GITHUB_API_TOKEN=
```

## Hot Module Replacement

In addition to calling `module.hot.accept` for our `App` component, we also have to call it for the
root reducer. This is done in [`src/store/index.js`](./src/store/index.js):

```javascript
module.hot.accept('../reducers/index.js', () => {
  const newReducer = require('../reducers').default;
  store.replaceReducer(newReducer);
});
```

## GitHub API Service

All business logic (data fetching) goes in the `services` folder, specifically the
[`services/github.js`](./services/github.js) file.

Note that we don't `catch` any rejected promises as that is handled by the consumers of these
functions (see below).

## Redux Async Thunks

This is the main reason I did this tutorial as I wanted to see how folks were doing data fetching in
Redux in 2020.

The tutorial uses thunks like this:

```javascript
const issuesSlice = createSlice({
  // ...
  reducers: {
    fetchIssuePending: (state) => {
      state.isLoading = true;
    },
    fetchIssueFulfilled: (state, action) => {
      const { number } = action.payload;
      state.issuesByNumber[number] = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchIssueRejected: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

const { fetchIssuePending, fetchIssueFulfilled, fetchIssueRejected } = issuesSlice.actions;

function fetchIssue(org, repo, number) {
  return async (dispatch) => {
    try {
      dispatch(fetchIssuePending());
      const issue = await getIssue(org, repo, number);
      dispatch(fetchIssueFulfilled(issue));
    } catch (error) {
      dispatch(fetchIssueRejected(error));
    }
  };
}
```

> Tip: add `no-param-reassign: 0` to your ESLint [`rules`](./.eslintrc.yml).

The outer function is passed whatever parameters are needed to make the request. The inner function
gets passed `dispatch` and `getState` functions by Redux Thunk middleware.

In our React components, we need to wrap `fetchIssue` in `dispatch` like this:

```javascript
const dispatch = useDispatch();
dispatch(fetchIssue('facebook', 'react', 1));
```

This pattern is nice, but it can be simplified even further using Redux Toolkit's `createAsyncThunk`
function.

`createAsyncThunk` takes a string and an async function (known as a "payload creator") as
parameters. It's important to note that if you need to pass multiple arguments to the payload
creator, you need to pass them in an object. This is because the second parameter is always the
thunk API object that includes methods like `dispatch` and `getState` amongst other things.

The above example can be simplifed to:

```javascript
const fetchIssue = createAsyncThunk('issues/fetchIssue', async ({ org, repo, number }) =>
  getIssue(org, repo, number),
);

const issuesSlice = createSlice({
  // ...
  extraReducers: {
    // issues/fetchIssue/pending
    [fetchIssue.pending]: (state) => {
      state.isLoading = true;
    },
    // issues/fetchIssue/fulfilled
    [fetchIssue.fulfilled]: (state, action) => {
      const { number } = action.payload;
      state.issuesByNumber[number] = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    // issues/fetchIssue/rejected
    [fetchIssue.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    },
  },
});
```

The first thing to point out is that we must put our action creators in the `extraReducers` object.
This is because Redux Toolkit will generate the action types for any functions in `reducers` for us.
In other words, the function `fetchIssuePending` is given the action type
`issues/fetchIssuePending`. The action creators derived from our async thunk already have their own
action types. For example `fetchIssue.pending` already has the action type
`issues/fetchIssue/pending`. One last thing to point out is that if you manually create an action
in `reducers` with the same type as one in `extraReducers`, the one in `reducers` will always be
called instead of the one in `extraReducers`.

Note that our `rejected` action references `action.error`. This property only exists on `action` if
the promise rejects. See [Promise Lifecycle Actions](https://redux-toolkit.js.org/api/createAsyncThunk#promise-lifecycle-actions)
in the docs for more information.

Also note that we don't need to `return await getIssue()` because async functions will always return
a promise (that's a JavaScript thing, not a Redux thing, though).

The error itself is serialized using logic extracted from [`sindresorhus/serialize-error`](https://github.com/sindresorhus/serialize-error),
so it is not the `Error` instance itself. This is nice because you are only supposed to put
primitive types, arrays, and objects in your store and never classes, instances, or functions.

If you want to return a payload when the promise rejects, you can use the `rejectWithValue`
function. I don't have any examples using it in the app, but it works like this:

```javascript
const fetchIssue = createAsyncThunk('issues/fetchIssue', async ({ org, repo, number }, { rejectWithValue }) =>
  try {
    const issue = await getIssue(org, repo, number);
    return issue;
  } catch (error) {
    return rejectWithValue('An error message to render in your app');
  }
);

const issuesSlice = createSlice({
  // ...
  extraReducers: {
    // ...
    [fetchIssue.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload; // payload is the string we passed to `rejectWithValue`.
    },
  },
});
```

Another neat thing you can do with thunks created by `createAsyncThunk` is treating them like
promises. This is useful if you need to ensure that an action fulfills before doing something else.

The `dispatch` function actually returns a promise that always resolves. We can pass a special
function exported by Redux Toolkit, `unwrapResult`, to the promise's `then` method.

```javascript
import { unwrapResult } from '@reduxjs/toolkit';

// ...

try {
  await dispatch(fetchIssue('facebook', 'react', 1)).then(unwrapResult);
  // do something else
} catch (error) {
  // do something if there was an error
}
```

## Canceling Async Thunks

I also didn't include any cancellation examples in the app, but it's good to know there are a couple
ways to do it.

### Canceling Before Payload Creator Invocation

If you want to conditionally call the payload creator, you can pass an object with a `condition`
method as the third argument to `createAsyncThunk`. Simply return `false` in this method, and the
payload creator will not be called.

```javascript
const fetchIssue = createAsyncThunk(
  'issues/fetchIssue',
  async ({ org, repo, number }) => getIssue(org, repo, number),
  {
    condition: (_, { getState }) => {
      const { isLoading } = getState();
      return !isLoading;
    },
  },
);
```

Note that the return value of `condition` is compared to `false` using strict equality (`===`), so
it must be `false` and not any other falsey value.

Also note that if `condition` returns `false`, no action will be dispatched. If you want the
`rejected` action to dispatch, you must set the option `dispatchConditionRejection` to `true`.

```javascript
const fetchIssue = createAsyncThunk(
  // ...
  {
    condition: () => {},
    dispatchConditionRejection: true,
  },
);
```

### Canceling an In-flight Request

The promise returned from `dispatch` will have an `abort` method which you can call to cancel the
thunk before it has finished executing.

How you handle the abort signal will depend on whether you're using Fetch or Axios.

#### Axios Example

```javascript
async function getIssue(org, repo, number, signal) {
  // The static method `source` is a factory function that returns a source object.
  const source = axios.CancelToken.source();

  // Listen for the `abort` event and cancel.
  signal.addEventListener('abort', () => {
    source.cancel();
  });

  // Set the `cancelToken` option to `source.token`.
  const { data } = await axios.get(url, { cancelToken: source.token });

  return data;
}

const fetchIssue = createAsyncThunk(
  'issues/fetchIssue',
  // We get the signal from the thunk API object.
  async ({ org, repo, number }, { signal }) => getIssue(org, repo, number, signal),
);

const promise = dispatch(fetchIssue({ org, repo, number }));

// Fire the `abort` event somewhere in your app.
promise.abort();
```

#### Fetch Example

```javascript
async function getIssue(org, repo, number, signal) {
  const response = await fetch(url, { signal });
  const json = await response.json();
  return json;
}

const fetchIssue = createAsyncThunk(
  'issues/fetchIssue',
  async ({ org, repo, number }, { signal }) => getIssue(org, repo, number, signal),
);

const promise = dispatch(fetchIssue({ org, repo, number }));

promise.abort();
```

Note that like Fetch itself, only modern browsers support the [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
interface, whereas Axios' implementation is promise-based.

## Working with Entities using `createEntityAdapter`

Redux Toolkit has ported [`@ngrx/entity`](https://ngrx.io/guide/entity) for performing CRUD
operations on collections of records in the store.

An entity could be a row or document in a database with a unique ID. In this app, a good example of
an entity is an issue.

When you use an `entityAdapter` in one of your slices, it will create an array of `ids` and a lookup
table (a JavaScript object) of `entities` mapped to their ID. The `ids` array can optionally be
provided a sorting function.

In the original example from the tutorial, our `issues` slice had a `currentPageIssues` array and an
`issuesByNumber` object. These can be replaced with `ids` and `entities` respectively. We also want
to ensure that the IDs (the issue numbers) are sorted in descending order, so newer issues appear
first.

The finished slice looks like this:

```javascript
const issuesAdapter = createEntityAdapter({
  selectId: (issue) => issue.number,
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
```

The first thing to note is that we must supply a `selectId` function to `createEntityAdapater`. By
default, it will look for an `id` property on each entity. If that property doesn't exist, or if we
want to use another property, we must define it. In this example, we want to use the `number`
property.

The next thing to note is that we pass additional state properties to `getInitialState`. We can
dispatch actions to update these properties like we would in a regular Redux reducer. We do not need
to define `ids` or `entities` though.

The most important thing to note is that we are not setting `ids` or `entities` directly. When we
fetch an individual issue, we use `upsertOne` and pass it the current state and the issue. An upsert
operation is simply an update or insert if it doesn't exist. When we fetch an array of issues, we
use `setAll`, which replaces all of the currently displayed issues.

See [CRUD Functions](https://redux-toolkit.js.org/api/createEntityAdapter#crud-functions) in the
docs for more operations you can use.

## Alternatives

There are a ton of state management libraries for JavaScript and React. Currently, [`recoil`](https://github.com/facebookexperimental/Recoil)
looks very exciting.

You can also get very far these days using React's built-in `useContext`, `useState`, and
`useReducer` hooks.

Finally, [`use-http`](https://github.com/ava/use-http) and [`swr`](https://github.com/vercel/swr)
are hooks for data fetching that support Suspense out of the box (amongst other powerful features).
