import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import i18n from './services/i18n';
import socketService from './services/socket';
import notificationService from './services/notification';
import './index.css';

// Initialize socket connection if user is logged in
const token = localStorage.getItem('token');
if (token) {
  socketService.connect();
}

// Request notification permission
if ("Notification" in window && Notification.permission === "default") {
  Notification.requestPermission();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </I18nextProvider>
  </React.StrictMode>
);

// Cleanup on unmount
window.addEventListener('unload', () => {
  socketService.disconnect();
});
