//App.js
import React, { useEffect, useState } from 'react';

//import React components
import Header from './header/Header';
import MainPanel from './mainPanel/MainPanel';
import LeftPanel from './leftPanel/LeftPanel';
import RightPanel from './rightPanel/RightPanel';
import Options from './options/Options';

const server = 'http://localhost:4000'

const App = () => {
  return (
    <div className="app">
      <Header />
      <div className = "panels">
        <ul>
          <li><LeftPanel /></li>
          <li><MainPanel /></li>
          <li><RightPanel /></li>
        </ul>
      </div>
      <Options />
      <div className = "lower-half">
        <div className = "divider"/>
      </div>
    </div>
  )
}

export default App;