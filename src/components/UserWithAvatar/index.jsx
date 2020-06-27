import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './styles.module.css';

function UserWithAvatar({ user, orientation, link, classes }) {
  const linkClassnames = classnames(styles.issueUser, {
    [styles.vertical]: orientation === 'vertical',
    [styles.horizontal]: orientation === 'horizontal',
  });

  const avatarClassnames = classnames(styles.avatar, classes.avatar);

  const usernameClassnames = classnames(styles.username, classes.username);

  const children = (
    <>
      <img className={avatarClassnames} src={user.avatar_url} alt="" />
      <div className={usernameClassnames}>{user.login}</div>
    </>
  );

  return link ? (
    <a href={`https://github.com/${user.login}`} className={linkClassnames}>
      {children}
    </a>
  ) : (
    <span className={linkClassnames}>{children}</span>
  );
}

UserWithAvatar.defaultProps = {
  orientation: 'vertical',
  link: true,
  classes: {},
};

UserWithAvatar.propTypes = {
  user: PropTypes.shape({
    avatar_url: PropTypes.string.isRequired,
    login: PropTypes.string.isRequired,
  }).isRequired,
  orientation: PropTypes.string,
  link: PropTypes.bool,
  classes: PropTypes.shape({ avatar: PropTypes.string, username: PropTypes.string }),
};

export default UserWithAvatar;
