import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import UserWithAvatar from '../UserWithAvatar';

import styles from './styles.module.css';

function IssueNumber({ issue }) {
  return (
    <span className={classnames('issue-detail__number', styles.number)}>{`#${issue.number}`}</span>
  );
}

IssueNumber.propTypes = {
  issue: PropTypes.shape({
    number: PropTypes.number.isRequired,
    state: PropTypes.string.isRequired,
    user: UserWithAvatar.propTypes.user,
  }).isRequired,
};

function IssueState({ issue }) {
  return (
    <span
      className={classnames('issue-detail__state', styles.issueState, {
        [styles.open]: issue.state === 'open',
      })}
    >
      {issue.state}
    </span>
  );
}

IssueState.propTypes = IssueNumber.propTypes;

function IssueMeta({ issue }) {
  return (
    <div className={classnames('issue-detail__meta', styles.meta)}>
      <IssueNumber issue={issue} />
      <IssueState issue={issue} />
      <UserWithAvatar user={issue.user} orientation="horizontal" />
    </div>
  );
}

IssueMeta.propTypes = IssueNumber.propTypes;

export default IssueMeta;
