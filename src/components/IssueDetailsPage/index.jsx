import './styles.css';

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import classnames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import IssueComments from '../IssueComments';
import IssueLabels from '../IssueLabels';
import IssueMeta from '../IssueMeta';

import { fetchComments } from '../../reducers/comments';
import { fetchIssue } from '../../reducers/issues';

import { insertMentionLinks } from '../../utils';

import styles from './styles.module.css';

function IssueDetailsPage({ org, repo, issueId, showIssuesList }) {
  const dispatch = useDispatch();

  const issue = useSelector((state) => state.issues.entities[issueId]);

  const { commentsLoading, commentsError, comments } = useSelector((state) => {
    return {
      commentsLoading: state.comments.loading,
      commentsError: state.comments.error,
      comments: state.comments.entities[issueId],
    };
  }, shallowEqual);

  useEffect(() => {
    if (!issue) {
      dispatch(fetchIssue({ org, repo, issueId }));
    }

    // Since we may have the issue already, ensure we're scrolled to the top.
    window.scrollTo({ top: 0 });
  }, [issue, dispatch, org, repo, issueId]);

  useEffect(() => {
    if (issue) {
      dispatch(fetchComments(issue));
    }
  }, [issue, dispatch]);

  let children;
  let renderedComments;

  const backToIssueListButton = (
    <button type="button" className="pure-button" onClick={showIssuesList}>
      Back to Issues List
    </button>
  );

  if (issue === null) {
    children = (
      <div className="issue-detail--loading">
        {backToIssueListButton}
        <p>{`Loading issue #${issueId}...`}</p>
      </div>
    );
  }

  if (issue !== null) {
    // Each `comments` object has an array of `comments` which is confusing and I probably wouldn't
    // do this at work.
    if (typeof comments !== 'undefined' && typeof comments.comments !== 'undefined') {
      renderedComments = <IssueComments issue={issue} comments={comments.comments} />;
    }

    if (commentsLoading) {
      renderedComments = (
        <div className="issue-detail--error">
          <p>Loading comments...</p>
        </div>
      );
    }

    if (commentsError !== null) {
      renderedComments = (
        <div className="issue-detail--error">
          <h1>{`Could not load comments for issue #${issueId}`}</h1>
          <p>{commentsError.toString()}</p>
        </div>
      );
    }

    children = (
      <div className={classnames('issueDetailsPage', styles.issueDetailsPage)}>
        <h1 className="issue-detail__title">{issue.title}</h1>
        {backToIssueListButton}
        <IssueMeta issue={issue} />
        <IssueLabels labels={issue.labels} className={styles.issueLabels} />
        <hr className={styles.divider} />
        <div className={styles.summary}>
          <ReactMarkdown className="testing" source={insertMentionLinks(issue.body)} />
        </div>
        <hr className={styles.divider} />
        <ul>{renderedComments}</ul>
      </div>
    );
  }

  return <div>{children}</div>;
}

IssueDetailsPage.propTypes = {
  org: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  issueId: PropTypes.number.isRequired,
  showIssuesList: PropTypes.func.isRequired,
};

export default IssueDetailsPage;
