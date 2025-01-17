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
    Menu,
    MenuItem,
    Badge,
} from '@mui/material';
import { FaBuilding, FaBell, FaCog } from 'react-icons/fa';
import MenuIcon from '@mui/icons-material/Menu';
import { MdAccountCircle, MdPayment, MdShowChart } from 'react-icons/md';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import CustomButton from '../../common/CustomButton/CustomButton';
import { NavItem, SubNavItem } from '../../../types/common';
import { useAuth } from '../../../hooks/useAuth';
import { useAuthStore } from '../../../stores/authStore';

const Header: React.FC = () => {
    const [navMenuAnchor, setNavMenuAnchor] = React.useState<null | HTMLElement>(null);
    const [profileMenuAnchor, setProfileMenuAnchor] = React.useState<null | HTMLElement>(null);
    
    const navItems: NavItem[] = [
        { label: 'Sobre', to: '/sobre' },
        { label: 'Serviços', to: '/servicos' },
        { label: 'Contato', to: '/contato' },
    ];

const authNavItems: NavItem[] = [
    { 
        label: 'Início', 
        to: '/dashboard', 
        icon: <MdAccountCircle />,
    },
    { 
        label: 'Conta', 
        to: '/dashboard/conta', 
        icon: <MdAccountCircle />,
        subItems: [
            { label: 'Informações Pessoais', to: '/dashboard/conta/perfil' },
            { label: 'Documentos', to: '/dashboard/conta/documentos' },
            { label: 'Preferências', to: '/dashboard/conta/preferencias' }
        ]
    },
    { 
        label: 'Criptomoedas', 
        to: '/dashboard/crypto', 
        icon: <MdShowChart />,
        subItems: [
            { label: 'Comprar/Vender', to: '/dashboard/crypto/trade' },
            { label: 'Carteira', to: '/dashboard/crypto/wallet' },
            { label: 'Conversor', to: '/dashboard/crypto/converter' }
        ]
    },
    { 
        label: 'Transferências', 
        to: '/dashboard/payments', 
        icon: <MdPayment />,
        subItems: [
            { label: 'Boletos', to: '/dashboard/payments/boletos' },
            { label: 'PIX', to: '/dashboard/payments/pix' },
            { label: 'Transferências', to: '/dashboard/payments/transferencias' }
        ]
    },
    { 
        label: 'Configurações', 
        to: '/dashboard/settings', 
        icon: <FaCog />,
        subItems: [
            { label: 'Segurança', to: '/dashboard/settings/seguranca' },
            { label: 'Notificações', to: '/dashboard/settings/notificacoes' },
            { label: 'Privacidade', to: '/dashboard/settings/privacidade' }
        ]
    },
];

    const handleNavMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setNavMenuAnchor(event.currentTarget);
    };

    const handleNavMenuClose = () => {
        setNavMenuAnchor(null);
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setProfileMenuAnchor(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setProfileMenuAnchor(null);
    };
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
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: 'rgba(241, 196, 15, 0.1)',
                                transform: 'translateX(5px)',
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
                sx={{
                    color: '#ffffff',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(241, 196, 15, 0.1)',
                        transform: 'scale(1.1)',
                    },
                }}
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
                        transition: 'all 0.3s ease',
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
        const isAuthPage = location.pathname === '/login' || 
                         location.pathname === '/signup';

        if (isAuthPage) {
            return null;
        }

        if (isAuthenticated && user) {
            const displayName = capitalizeName(user.profile?.name || user.profile?.email.split('@')[0]);
            
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Ícone de Notificações */}
                    <IconButton 
                        size="large"
                        sx={{
                            color: '#ffffff',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: 'rgba(241, 196, 15, 0.1)',
                                transform: 'scale(1.1)',
                            },
                        }}
                    >
                        <Badge badgeContent={4} color="error">
                            <FaBell />
                        </Badge>
                    </IconButton>

                    {/* Menu de Navegação */}
                    <Button
                        onClick={handleNavMenuOpen}
                        sx={{
                            color: '#ffffff',
                            textTransform: 'none',
                            fontSize: '1rem',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: 'rgba(241, 196, 15, 0.1)',
                                transform: 'translateY(-2px)',
                            },
                        }}
                    >
                        Menu
                    </Button>
                    <Menu
                        anchorEl={navMenuAnchor}
                        open={Boolean(navMenuAnchor)}
                        onClose={handleNavMenuClose}
                        sx={{
                            '& .MuiPaper-root': {
                                backgroundColor: '#1e1e1e',
                                color: '#ffffff',
                                minWidth: '200px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                transition: 'all 0.3s ease',
                                transformOrigin: 'top center',
                                '& .MuiMenuItem-root': {
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: 'translateX(5px)',
                                    },
                                },
                            },
                        }}
                        TransitionProps={{
                            timeout: 150,
                        }}
                    >
                        {authNavItems.map((item) => (
                            <MenuItem
                                key={item.label}
                                component={RouterLink}
                                to={item.to}
                                onClick={handleNavMenuClose}
                                sx={{
                                    gap: 2,
                                    '&:hover': {
                                        backgroundColor: 'rgba(241, 196, 15, 0.1)',
                                    },
                                }}
                            >
                                {item.icon}
                                {item.label}
                            </MenuItem>
                        ))}
                    </Menu>

                    {/* Menu de Perfil */}
                    <IconButton
                        onClick={handleProfileMenuOpen}
                        sx={{
                            color: '#ffffff',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: 'rgba(241, 196, 15, 0.1)',
                                transform: 'scale(1.1)',
                            },
                        }}
                    >
                        <Avatar 
                            sx={{ 
                                width: 32, 
                                height: 32,
                                bgcolor: '#f1c40f',
                                color: '#1e1e1e',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {displayName[0]}
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={profileMenuAnchor}
                        open={Boolean(profileMenuAnchor)}
                        onClose={handleProfileMenuClose}
                        sx={{
                            '& .MuiPaper-root': {
                                backgroundColor: '#1e1e1e',
                                color: '#ffffff',
                                minWidth: '200px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                transition: 'all 0.3s ease',
                                transformOrigin: 'top right',
                                '& .MuiMenuItem-root': {
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: 'translateX(5px)',
                                    },
                                },
                            },
                        }}
                        TransitionProps={{
                            timeout: 150,
                        }}
                    >
                        <MenuItem 
                            sx={{
                                pointerEvents: 'none',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                },
                            }}
                        >
                            <Typography variant="subtitle1">
                                {displayName}
                            </Typography>
                        </MenuItem>
                        <MenuItem
                            component={RouterLink}
                            to="/perfil"
                            onClick={handleProfileMenuClose}
                            sx={{
                                gap: 2,
                                '&:hover': {
                                    backgroundColor: 'rgba(241, 196, 15, 0.1)',
                                },
                            }}
                        >
                            <MdAccountCircle />
                            Editar Perfil
                        </MenuItem>
                        <MenuItem
                            component={RouterLink}
                            to="/seguranca"
                            onClick={handleProfileMenuClose}
                            sx={{
                                gap: 2,
                                '&:hover': {
                                    backgroundColor: 'rgba(241, 196, 15, 0.1)',
                                },
                            }}
                        >
                            <FaCog />
                            Segurança
                        </MenuItem>
                        <MenuItem
                            onClick={handleLogout}
                            sx={{
                                gap: 2,
                                color: '#ff4444',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 68, 68, 0.1)',
                                },
                            }}
                        >
                            <MdAccountCircle />
                            Sair
                        </MenuItem>
                    </Menu>
                </Box>
            );
        }

        return (
            <Box sx={{ display: 'flex', gap: 2 }}>
                <CustomButton
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    sx={{
                        borderColor: '#f1c40f',
                        color: '#f1c40f',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            borderColor: '#d4ac0d',
                            transform: 'translateY(-2px)',
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
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: '#d4ac0d',
                            transform: 'translateY(-2px)',
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
                boxShadow: '0 2px 10px rgba(184, 134, 11, 0.04)',
                transition: 'all 0.3s ease',
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                color: '#f1c40f',
                                transform: 'translateY(-2px)',
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
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            color: '#f1c40f',
                                            transform: 'translateY(-2px)',
                                        },
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>
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
