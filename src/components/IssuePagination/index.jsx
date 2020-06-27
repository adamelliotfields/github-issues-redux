import './styles.css';

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Paginate from 'react-paginate';

import styles from './styles.module.css';

function IssuePagination({ currentPage, pageCount, onPageChange }) {
  return (
    <div className={classnames('issuesPagination', styles.pagination)}>
      <Paginate
        forcePage={currentPage}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={onPageChange}
        nextLabel="&rarr;"
        previousLabel="&larr;"
      />
    </div>
  );
}

IssuePagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default IssuePagination;
