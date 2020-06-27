import React from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';

import UserWithAvatar from '../UserWithAvatar';

import { insertMentionLinks } from '../../utils';

import styles from './styles.module.css';

function IssueComment({ comment }) {
  return (
    <div className={styles.comment}>
      <UserWithAvatar
        user={comment.user}
        classes={{ avatar: styles.avatar, username: styles.username }}
        orientation="horizontal"
      />

      <div className={styles.body}>
        <ReactMarkdown className="markdown" source={insertMentionLinks(comment.body)} />
      </div>
    </div>
  );
}

IssueComment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    body: PropTypes.string.isRequired,
    user: UserWithAvatar.propTypes.user,
  }).isRequired,
};

function IssueComments({ comments, issue }) {
  if (issue.comments === 0) {
    return <div className="issue-detail--no-comments">No comments</div>;
  }

  if (!comments || comments.length === 0) {
    return <div className="issue-detail--comments-loading">Comments loading...</div>;
  }

  return (
    <ul className={styles.commentsList}>
      {comments.map((comment) => (
        <li key={comment.id}>
          <IssueComment comment={comment} />
        </li>
      ))}
    </ul>
  );
}

IssueComments.defaultProps = {
  comments: [],
};

IssueComments.propTypes = {
  comments: PropTypes.arrayOf(IssueComment.propTypes.comment),
  issue: PropTypes.shape({ comments: PropTypes.number.isRequired }).isRequired,
};

export default IssueComments;
