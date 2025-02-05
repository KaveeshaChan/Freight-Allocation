import React from 'react';
import Header from './Header';

const dashboard = ({ children }) => {
  return (
    <Header>
    <div>
      <h1>Header Section</h1>
      {children}
    </div>
    </Header>
  );
};

export default dashboard;