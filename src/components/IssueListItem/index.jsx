import React from 'react';
import PropTypes from 'prop-types';

import { shorten } from '../../utils';

import IssueLabels from '../IssueLabels';
import UserWithAvatar from '../UserWithAvatar';

import styles from './styles.module.css';

function IssueListItem({ issue, showIssueComments }) {
  const { number, comments, user, title, body, labels } = issue;

  const onIssueClicked = (e) => {
    e.preventDefault();
    e.stopPropagation();
    showIssueComments(number);
  };

  const pluralizedComments = comments === 1 ? 'comment' : 'comments';

  return (
    <div className={styles.issue}>
      <UserWithAvatar user={user} />
      <div className="issue__body">
        <a href="#comments" onClick={onIssueClicked}>
          <span className={styles.number}>{`#${number}`}</span>
          <span className={styles.title}>{title}</span>
        </a>
        <br />
        {`(${comments} ${pluralizedComments})`}
        <p className="issue__summary">{shorten(body)}</p>
        <IssueLabels labels={labels} className={styles.label} />
      </div>
    </div>
  );
}

IssueListItem.propTypes = {
  showIssueComments: PropTypes.func.isRequired,
  issue: PropTypes.shape({
    id: PropTypes.number.isRequired,
    number: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    // eslint-disable-next-line react/require-default-props
    labels: IssueLabels.propTypes.labels,
    // eslint-disable-next-line react/require-default-props
    user: UserWithAvatar.propTypes.user,
    comments: PropTypes.number.isRequired,
    body: PropTypes.string.isRequired,
  }).isRequired,
};

export default IssueListItem;
