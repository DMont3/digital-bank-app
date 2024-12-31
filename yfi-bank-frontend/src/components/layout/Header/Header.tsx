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
} from '@mui/material';
import { FaBuilding } from 'react-icons/fa';
import logo from '../../../assets/logo.png';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import CustomButton from '../../common/CustomButton/CustomButton';
import { NavItem } from '../../../types/common';
import { useAuth } from '../../../hooks/useAuth';
import { api } from '../../../services/api';
import { formatCurrency } from '../../../utils/formatters';
import { useAppStore } from '../../../stores/appStore';

interface HeaderProps {
    navItems?: NavItem[];
}

const Header: React.FC<HeaderProps> = ({ navItems = [
  { label: 'Sobre', to: '/sobre' },
  { label: 'Serviços', to: '/servicos' },
  { label: 'Contato', to: '/contato' },
] }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null); // Moved here
  const open = Boolean(anchorEl); // Moved here

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
      setAnchorEl(null);
  };

  const handleLogout = async () => {
      try {
          await api.post('/auth/logout');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
          document.cookie = 'sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
          window.location.href = '/';
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

  const renderAuthButtons = () => {
      if (user) {
          return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton
                      onClick={handleClick}
                      sx={{ p: 0 }}
                  >
                      <Avatar sx={{ bgcolor: '#f1c40f', color: '#1e1e1e' }}>{user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}</Avatar>
                  </IconButton>
                  <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                          'aria-labelledby': 'basic-button',
                      }}
                      PaperProps={{
                          style: {
                              backgroundColor: '#1e1e1e',
                              color: '#ffffff',
                          },
                      }}
                  >
                      <MenuItem onClick={handleLogout}>Sair</MenuItem>
                  </Menu>
              </Box>
          );
      }

      return (
          <Box sx={{ display: 'flex', gap: 2 }}>
              <CustomButton
                  component={RouterLink}
                  to="/signup"
                  variant="contained"
                  color="primary"
              >
                  Abrir Conta
              </CustomButton>
              <CustomButton
                  component={RouterLink}
                  to="/login"
                  variant="text"
                  color="primary"
                  sx={{ border: 'none' }}
              >
                  Entrar
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
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Logo Section */}
              <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', '&:hover': { color: '#f1c40f' }, color: '#ffffff' }}>
                  <FaBuilding size={30} style={{ marginRight: 8 }} />
                  <Typography
                      variant="h6"
                      sx={{
                          color: '#ffffff',
                      }}
                  >
                      YFI BANK
                  </Typography>
              </Box>

              {/* Navigation Links (Centered) */}
              {!isMobile && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', gap: 3 }}>
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
                  </Box>
              )}

              {/* Authentication Buttons */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {isMobile ? mobileView : renderAuthButtons()}
              </Box>
          </Toolbar>
      </AppBar>
  );
};

export default Header;