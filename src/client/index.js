import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

fetch('/api/').then(res => {
  console.log(res.json());
});

ReactDOM.render(<App />, document.getElementById('root'));
