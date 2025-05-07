import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';          // <-- Add this
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>                     {/* <-- Wrap App */}
      <App />
    </Provider>
  </React.StrictMode>
);

// Optional: Measure performance
reportWebVitals();
