import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { fetchIssues } from '../../reducers/issues';
import { fetchRepoDetails } from '../../reducers/repo-details';

import IssuesPageHeader from '../IssuesPageHeader';
import IssuesList from '../IssuesList';
import IssuePagination from '../IssuePagination';

function IssuesListPage({ org, repo, page, setJumpToPage, showIssueComments }) {
  const dispatch = useDispatch();

  const { ids, isLoading, error: issuesError, entities, pageCount } = useSelector(
    (state) => state.issues,
  );

  const openIssueCount = useSelector((state) => state.repoDetails.openIssuesCount);

  const issues = ids.map((issueNumber) => entities[issueNumber]);

  useEffect(() => {
    dispatch(fetchIssues({ org, repo, page }));
    dispatch(fetchRepoDetails({ org, repo }));
  }, [org, repo, page, dispatch]);

  if (issuesError) {
    return (
      <div>
        <h1>Something went wrong...</h1>
        <div>{issuesError.toString()}</div>
      </div>
    );
  }

  const currentPage = Math.min(pageCount, Math.max(page, 1)) - 1;

  const renderedList = isLoading ? (
    <h3>Loading...</h3>
  ) : (
    <IssuesList issues={issues} showIssueComments={showIssueComments} />
  );

  const onPageChanged = (selectedItem) => {
    const newPage = selectedItem.selected + 1;
    setJumpToPage(newPage);
  };

  return (
    <div id="issue-list-page">
      <IssuesPageHeader openIssuesCount={openIssueCount} org={org} repo={repo} />
      {renderedList}
      <IssuePagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={onPageChanged}
      />
    </div>
  );
}

IssuesListPage.defaultProps = {
  page: 1,
};

IssuesListPage.propTypes = {
  org: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  page: PropTypes.number,
  setJumpToPage: PropTypes.func.isRequired,
  showIssueComments: PropTypes.func.isRequired,
};

export default IssuesListPage;
