import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import IssueDetailsPage from './IssueDetailsPage';
import IssuesListPage from './IssuesListPage';
import RepoSearchForm from './RepoSearchForm';

import { displayRepo, setCurrentDisplayType, setCurrentPage } from '../reducers/issues-display';

import styles from './App.module.css';

function App() {
  const dispatch = useDispatch();

  const { org, repo, displayType, page, issueId } = useSelector((state) => state.issuesDisplay);

  const setOrgAndRepo = (o, r) => {
    dispatch(displayRepo({ org: o, repo: r }));
  };

  const setJumpToPage = (p) => {
    dispatch(setCurrentPage(p));
  };

  const showIssuesList = () => {
    dispatch(setCurrentDisplayType({ displayType: 'issues' }));
  };

  const showIssueComments = (id) => {
    dispatch(setCurrentDisplayType({ displayType: 'comments', issueId: id }));
  };

  let children;

  if (displayType === 'issues') {
    children = (
      <>
        <RepoSearchForm
          org={org}
          repo={repo}
          setOrgAndRepo={setOrgAndRepo}
          setJumpToPage={setJumpToPage}
        />
        <IssuesListPage
          org={org}
          repo={repo}
          page={page}
          setJumpToPage={setJumpToPage}
          showIssueComments={showIssueComments}
        />
      </>
    );
  } else if (issueId !== null) {
    const key = `${org}/${repo}/${issueId}`;

    children = (
      <IssueDetailsPage
        key={key}
        org={org}
        repo={repo}
        issueId={issueId}
        showIssuesList={showIssuesList}
      />
    );
  }

  return <div className={styles.app}>{children}</div>;
}

export default App;
