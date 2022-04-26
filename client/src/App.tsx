import React from 'react';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import { PageLayout } from './views/layout';

function App() {
  return (
    <div className='root-page'>
      <Router>
        <PageLayout></PageLayout>
      </Router>
    </div>
  );
}

export default App;
