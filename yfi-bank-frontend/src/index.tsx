// src/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const container = document.getElementById('root');
if (!container) {
    throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Reset CSS e estilos base do MUI */}
            <App />
        </ThemeProvider>
    </React.StrictMode>
);
