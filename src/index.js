import React from 'react';
import ReactDOM from 'react-dom/client';
import chatbotprototype from './chatbotprototype';
// import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <chatbotprototype />
  </React.StrictMode>
);
reportWebVitals();
