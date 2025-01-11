import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    useMediaQuery,
    useTheme,
    Avatar,
} from '@mui/material';
import { FaBuilding } from 'react-icons/fa';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import CustomButton from '../../common/CustomButton/CustomButton';
import { NavItem } from '../../../types/common';
import { useAuth } from '../../../hooks/useAuth';
import { useAuthStore } from '../../../stores/authStore';

const Header: React.FC = () => {
    const navItems: NavItem[] = [
        { label: 'Sobre', to: '/sobre' },
        { label: 'Serviços', to: '/servicos' },
        { label: 'Contato', to: '/contato' },
    ];
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
  const { logout } = useAuth();
  const { isAuthenticated, user } = useAuthStore();
  

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const drawer = (
        <Box
            onClick={handleDrawerToggle}
            sx={{
                textAlign: 'center',
                backgroundColor: '#1e1e1e',
                paddingTop: 2,
                height: '100%',
            }}
        >
            <Typography variant="h6" sx={{ my: 2, color: '#ffffff' }}>
                YFI BANK
            </Typography>
            <List>
                {navItems.map((item) => (
                    <ListItem
                        key={item.label}
                        component={RouterLink}
                        to={item.to}
                        sx={{
                            textAlign: 'center',
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: 'rgba(241, 196, 15, 0.1)',
                            },
                        }}
                    >
                        <ListItemText primary={item.label} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const mobileView = (
        <React.Fragment>
            <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                anchor="top"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: '100%',
                        backgroundColor: '#1e1e1e',
                        paddingTop: 2,
                    },
                }}
            >
                {drawer}
            </Drawer>
        </React.Fragment>
    );

    const capitalizeName = (name: string) => {
        return name.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const renderAuthButtons = (): JSX.Element | null => {
        // Verifica se a rota atual é login ou signup
        const isAuthPage = location.pathname === '/login' || 
                         location.pathname === '/signup';

        // Não mostra os botões de autenticação nas páginas de login/signup
        if (isAuthPage) {
            return null;
        }

        // Interface para usuário logado
        if (isAuthenticated && user) {
            const displayName = capitalizeName(user.profile?.name || user.profile?.email.split('@')[0]);
            
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ color: '#f1c40f' }}>
                        Olá, {displayName}
                    </Typography>
                    <CustomButton
                        component={RouterLink}
                        to="/dashboard"
                        variant="contained"
                        sx={{
                            backgroundColor: '#f1c40f',
                            '&:hover': {
                                backgroundColor: '#d4ac0d',
                            },
                        }}
                    >
                        Dashboard
                    </CustomButton>
                    <CustomButton
                        onClick={handleLogout}
                        variant="contained"
                        sx={{
                            backgroundColor: '#ff4444',
                            '&:hover': {
                                backgroundColor: '#cc0000',
                            },
                        }}
                    >
                        Sair
                    </CustomButton>
                </Box>
            );
        }

        // Interface para usuário não logado
        return (
            <Box sx={{ display: 'flex', gap: 2 }}>
                <CustomButton
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    sx={{
                        borderColor: '#f1c40f',
                        color: '#f1c40f',
                        '&:hover': {
                            borderColor: '#d4ac0d',
                        },
                    }}
                >
                    Entrar
                </CustomButton>
                <CustomButton
                    component={RouterLink}
                    to="/signup"
                    variant="contained"
                    sx={{
                        backgroundColor: '#f1c40f',
                        '&:hover': {
                            backgroundColor: '#d4ac0d',
                        },
                    }}
                >
                    Abrir Conta
                </CustomButton>
            </Box>
        );
    };

    return (
        <AppBar 
            position="fixed" 
            sx={{
                background: 'rgba(30, 30, 30, 0.8)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(184, 134, 11, 0.1)',
                boxShadow: '0 2px 10px rgba(184, 134, 11, 0.04)'
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Logo Section - Left */}
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    flex: '1 1 0'
                }}>
                    <FaBuilding size={24} color="#ffffff" />
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{
                            marginLeft: 1,
                            color: '#ffffff',
                            textDecoration: 'none',
                            '&:hover': {
                                color: '#f1c40f',
                            },
                        }}
                    >
                        YFI BANK
                    </Typography>
                </Box>

                {isMobile ? (
                    mobileView
                ) : (
                    <>
                        {/* Links de navegação centralizados */}
                        <Box sx={{ 
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: 3
                        }}>
                            {navItems.map((item) => (
                                <Button
                                    key={item.label}
                                    component={RouterLink}
                                    to={item.to}
                                    sx={{
                                        color: '#ffffff',
                                        '&:hover': {
                                            color: '#f1c40f',
                                        },
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>
                        {/* Botões de autenticação */}
                        <Box sx={{ marginLeft: 'auto' }}>
                            {renderAuthButtons()}
                        </Box>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
