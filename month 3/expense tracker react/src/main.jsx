import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="810729418117-vt0tcqooviufg6lnpujltql80n0p3304.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
    {/* <App/> */}
  </React.StrictMode>,
)
