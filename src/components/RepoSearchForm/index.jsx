import './styles.css';

import React, { useState } from 'react';
import PropTypes from 'prop-types';

function RepoSearchForm({ org, repo, setOrgAndRepo, setJumpToPage }) {
  const [currentOrg, setCurrentOrg] = useState(org);
  const [currentRepo, setCurrentRepo] = useState(repo);
  const [currentPageText, setCurrentPageText] = useState('1');

  const onOrgChanged = (e) => {
    setCurrentOrg(e.target.value);
  };

  const onRepoChanged = (e) => {
    setCurrentRepo(e.target.value);
  };

  const onCurrentPageChanged = (e) => {
    setCurrentPageText(e.target.value);
  };

  const onLoadRepoClicked = () => {
    setOrgAndRepo(currentOrg, currentRepo);
  };

  const onJumpToPageClicked = () => {
    const newPage = parseInt(currentPageText, 10);

    if (newPage >= 1) {
      setJumpToPage(newPage);
    }
  };

  return (
    <form className="pure-form">
      <div>
        <label htmlFor="org" style={{ marginRight: 5 }}>
          Org:&nbsp;
          <input id="org" name="org" value={currentOrg} onChange={onOrgChanged} />
        </label>

        <label htmlFor="repo" style={{ marginRight: 5, marginLeft: 10 }}>
          Repo:&nbsp;
          <input name="repo" value={currentRepo} onChange={onRepoChanged} />
        </label>

        <button
          type="button"
          className="pure-button pure-button-primary"
          style={{ marginLeft: 5 }}
          onClick={onLoadRepoClicked}
        >
          Load Repo
        </button>
      </div>
      <div style={{ marginTop: 5 }}>
        <label htmlFor="jumpToPage" style={{ marginRight: 5 }}>
          Issues Page:&nbsp;
          <input name="jumpToPage" value={currentPageText} onChange={onCurrentPageChanged} />
        </label>

        <button
          type="button"
          className="pure-button pure-button-primary"
          style={{ marginLeft: 5 }}
          onClick={onJumpToPageClicked}
        >
          Jump to Page
        </button>
      </div>
    </form>
  );
}

RepoSearchForm.propTypes = {
  org: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  setOrgAndRepo: PropTypes.func.isRequired,
  setJumpToPage: PropTypes.func.isRequired,
};

export default RepoSearchForm;
