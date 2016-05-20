import qs from 'query-string';
import React from 'react';
import Link from '../Link';

const name = 'Simon';

const Nav = () => (
  <nav>
    <Link to="Home">Home</Link>
    <Link to={[ 'edit',  { name }]}>edit</Link>
    <Link to={[ 'test', { name }]}>TestDevice</Link>
    <Link to={[ 'signup', { name }]}>AccountView</Link>
    <Link to={[ 'login', { name }]}>login</Link>
  </nav>
);

export default Nav;
