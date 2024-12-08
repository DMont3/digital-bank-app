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
} from '@mui/material';
import { FaBuilding } from 'react-icons/fa';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import CustomButton from '../../common/CustomButton/CustomButton';
import { HeaderProps, NavItem } from '../../../types/common';

const Header: React.FC<HeaderProps> = ({ navItems = [
    { label: 'Sobre', to: '/sobre' },
    { label: 'Serviços', to: '/servicos' },
    { label: 'Contato', to: '/contato' },
] }) => {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

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

    const desktopView = (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 4 }}>
                {navItems.map((item) => (
                    <Button
                        key={item.to}
                        color="inherit"
                        component={RouterLink}
                        to={item.to}
                        sx={{ marginLeft: 2 }}
                    >
                        {item.label}
                    </Button>
                ))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CustomButton variant="contained" component={RouterLink} to="/signup" sx={{ marginRight: 2 }}>
                    Abra sua conta
                </CustomButton>
                <CustomButton variant="outlined" component={RouterLink} to="/login">
                    Entrar
                </CustomButton>
            </Box>
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <AppBar 
                position="fixed" 
                sx={{
                    background: 'rgba(30, 30, 30, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(241, 196, 15, 0.1)',
                }}
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'nowrap',
                        paddingX: { xs: 1, sm: 2, md: 4 },
                    }}
                >
                    <Box
                        component={RouterLink}
                        to="/"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            color: 'inherit',
                            flexGrow: isMobile ? 1 : 0,
                        }}
                    >
                        <FaBuilding size={24} color="#ffffff" />
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                marginLeft: 1,
                                fontWeight: 'bold',
                                color: '#ffffff',
                            }}
                        >
                            YFI BANK
                        </Typography>
                    </Box>

                    {isMobile ? mobileView : desktopView}
                </Toolbar>
            </AppBar>
            <Toolbar />
        </React.Fragment>
    );
};

export default Header;
