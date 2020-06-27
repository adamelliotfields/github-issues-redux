import React from 'react';
import PropTypes from 'prop-types';

import IssueListItem from '../IssueListItem';

import styles from './styles.module.css';

function IssuesList({ issues, showIssueComments }) {
  const renderedIssues = issues.map((issue) => (
    <li key={issue.id}>
      <IssueListItem issue={issue} showIssueComments={showIssueComments} />
    </li>
  ));

  return <ul className={styles.issuesList}>{renderedIssues}</ul>;
}

IssuesList.propTypes = {
  issues: PropTypes.arrayOf(IssueListItem.propTypes.issue).isRequired,
  showIssueComments: PropTypes.func.isRequired,
};

export default IssuesList;
