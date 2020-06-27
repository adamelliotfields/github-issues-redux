import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

function IssueLabels({ labels, className }) {
  return (
    <div className={classnames('issue__labels', className)}>
      {labels.map((label) => (
        <span
          key={label.id}
          className="issue__label"
          style={{
            boxShadow: `0 0 2px #${label.color}`,
            borderColor: `#${label.color}`,
          }}
        >
          {label.name}
        </span>
      ))}
    </div>
  );
}

IssueLabels.propTypes = {
  labels: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  className: PropTypes.string.isRequired,
};

export default IssueLabels;
