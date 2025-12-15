import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';  // Estilos Bootstrap
//https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.css
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // JS para navbar y collapse

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
