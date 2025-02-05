// Header.js
import React from 'react';
import header from './Header';

const Header = ({ children }) => {
  return (
    <header>
    <div>
      <h1>Header Section</h1>
      {children}
    </div>
    </header>
  );
};

export default Header;