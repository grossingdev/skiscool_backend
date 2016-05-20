import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

//todo import changePageTo from '../actions/changePageTo';
//todo import getLocation from '../helpers/getLocation';

const defaultProps = {
  shouldAddToHistory: true,
  shouldScrollToTop: true,
};

const propTypes = {
  children: PropTypes.oneOfType([ PropTypes.object, PropTypes.string ]).isRequired,
  dispatch: PropTypes.func.isRequired,
  shouldAddToHistory: PropTypes.bool,
  shouldScrollToTop: PropTypes.bool,
  to: PropTypes.oneOfType([ PropTypes.array, PropTypes.string ]).isRequired,
};

const Link = ({ children, dispatch, shouldAddToHistory, shouldScrollToTop, to, ...props }) => {
  const onClick = e => {
    e.preventDefault();
//todo dispatch( changePageTo( to, { shouldAddToHistory, shouldScrollToTop }));
  };

  return (
    <a href={ '' } onClick={ onClick } { ...props }>
      { children }
    </a>
  );
};

Link.defaultProps = defaultProps;
Link.propTypes = propTypes;

//todo const LinkContainer = connect()( Link );

export { Link };
//todo export default LinkContainer;
export default Link;

