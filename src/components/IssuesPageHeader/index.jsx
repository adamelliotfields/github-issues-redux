import React from 'react';
import PropTypes from 'prop-types';

function OrgRepo({ org, repo }) {
  return (
    <span>
      <a href={`https://github.com/${org}`} className="header__org">
        {org}
      </a>
      {' / '}
      <a href={`https://github.com/${org}/${repo}`} className="header__repo">
        {repo}
      </a>
    </span>
  );
}

OrgRepo.propTypes = {
  org: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
};

function IssuesPageHeader({ openIssuesCount, org, repo }) {
  if (openIssuesCount === -1) {
    return (
      <h1>
        {'Open issues for '}
        <OrgRepo org={org} repo={repo} />
      </h1>
    );
  }

  const pluralizedIssue = openIssuesCount === 1 ? 'issue' : 'issues';

  return (
    <h1>
      <span className="header__openIssues">{openIssuesCount}</span>
      {` open ${pluralizedIssue} for `}
      <OrgRepo org={org} repo={repo} />
    </h1>
  );
}

IssuesPageHeader.defaultProps = {
  openIssuesCount: -1,
};

IssuesPageHeader.propTypes = {
  ...OrgRepo.propTypes,
  openIssuesCount: PropTypes.number,
};

export default IssuesPageHeader;
