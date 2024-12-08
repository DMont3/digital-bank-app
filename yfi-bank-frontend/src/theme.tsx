// src/theme.tsx
import { createTheme, Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: string;
        };
    }
    interface ThemeOptions {
        status?: {
            danger?: string;
        };
    }
}

const theme: Theme = createTheme({
    palette: {
        mode: 'dark', // Define o modo escuro
        primary: {
            main: '#f1c40f', // Amarelo vibrante para destaques
        },
        secondary: {
            main: '#ffffff', // Branco para texto e elementos contrastantes
        },
        background: {
            default: '#121212', // Preto quase absoluto para fundo principal
            paper: '#1e1e1e', // Fundo para componentes como cards e AppBar
        },
        text: {
            primary: '#ffffff',
            secondary: '#f1c40f', // Amarelo para textos de destaque
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '3rem',
            marginBottom: '1rem',
        },
        h2: {
            fontWeight: 700,
            fontSize: '2.5rem',
            marginBottom: '1rem',
        },
        h3: {
            fontWeight: 700,
            fontSize: '2rem',
            marginBottom: '1rem',
        },
        body1: {
            fontSize: '1rem',
            color: '#f1c40f',
        },
        button: {
            textTransform: 'none',
            fontWeight: 'bold',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    textTransform: 'none',
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1e1e1e',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    transition: 'all 0.3s ease',
                }
            }
        }
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        }
    }
});

export default theme;
