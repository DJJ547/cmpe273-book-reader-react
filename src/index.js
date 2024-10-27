import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router} from 'react-router-dom';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google'; // If using Google OAuth
import 'semantic-ui-css/semantic.min.css'; // Import Semantic UI CSS

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      {/* If using Google OAuth, wrap the App with GoogleOAuthProvider */}
      <GoogleOAuthProvider clientId="606148332855-99f34fqns59clmeghqaqgdvje9jlpu4a.apps.googleusercontent.com">
      <App />
      </GoogleOAuthProvider>
    </Router> 
</React.StrictMode>
);
