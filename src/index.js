import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';          // <-- Add this
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>                     {/* <-- Wrap App */}
      <App />
      <ToastContainer
      position="top-right"
      autoClose={3000} 
      hideProgressBar={false} 
      newestOnTop={false} 
      closeOnClick 
      rtl={false} 
      pauseOnFocusLoss 
      draggable 
      pauseOnHover
      theme="colored"
    />
    </Provider>
  </React.StrictMode>
);

// Optional: Measure performance
reportWebVitals();
