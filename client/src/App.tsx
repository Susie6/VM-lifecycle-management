import React from 'react';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import { PageLayout } from './views/layout';
import { Provider } from 'react-redux';
import { store } from './store/store';

function App() {
  return (
    <Provider store={store}>
      <div className='root-page'>
        <Router>
          <PageLayout></PageLayout>
        </Router>
      </div>
    </Provider>
  );
}

export default App;
