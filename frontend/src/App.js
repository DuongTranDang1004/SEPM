// FE/src/App.js

import React from 'react';
import { BrowserRouter } from 'react-router-dom'; // ✅ ADD THIS
import AppRoutes from './AppRoutes';
import { MessageProvider } from './contexts/MessageContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <BrowserRouter> {/* ✅ ADD THIS - Router must be outermost */}
      <ThemeProvider>
        <MessageProvider>
          <AppRoutes />
        </MessageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;