import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { DepositProvider } from '../context/DepositContext';
import {
  Box,
  Drawer,
  CssBaseline,
  Toolbar,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery
} from '@mui/material';
import {
  MdDashboard,
  MdAccountBalance,
  MdShowChart,
  MdPayment,
  MdSettings,
  MdChevronLeft,
  MdChevronRight,
  MdExpandMore,
  MdExpandLess
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useSidebarStore } from '../../../stores/sidebarStore';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'isOpen' })<{
  isOpen?: boolean;
}>(({ theme, isOpen }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  minHeight: 'calc(140vh - 128px)', // Increased viewport height minus header and footer
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(isOpen && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isOpen, toggleSidebar, setSidebar } = useSidebarStore();
  const navigate = useNavigate();

  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);

  const handleItemClick = (path: string, hasSubItems?: boolean) => {
    if (hasSubItems) {
      setExpandedItem(expandedItem === path ? null : path);
    } else {
      navigate(path);
      if (isMobile) {
        useSidebarStore.getState().setSidebar(false);
      }
    }
  };

  const menuItems = [
    { text: 'Visão Geral', icon: <MdDashboard />, path: '/dashboard' },
    { text: 'Saldo', icon: <MdAccountBalance />, path: '/dashboard/balance' },
    { 
      text: 'Criptomoedas', 
      icon: <MdShowChart />, 
      path: '/dashboard/crypto',
      subItems: [
        { text: 'Compra e Venda', path: '/dashboard/crypto-transaction' }
      ]
    },
    { 
      text: 'Transferências e Pagamentos', 
      icon: <MdPayment />, 
      path: '/dashboard/pix',
      subItems: [
        { text: 'PIX', path: '/dashboard/pix/deposit' },
        { text: 'Histórico', path: '/dashboard/transaction-history' }
      ]
    },
    { text: 'Configurações', icon: <MdSettings />, path: '/dashboard/settings' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.default,
            borderRight: 'none',
            marginTop: '64px',
            height: 'calc(100vh - 128px)',
            overflowY: 'auto',
          },
        }}
        variant="persistent"
        anchor="left"
        open={isOpen}
      >
        <Box
          sx={{
            position: 'fixed',
            left: isOpen ? drawerWidth : 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create('left', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            backgroundColor: theme.palette.background.paper,
            borderRadius: '0 4px 4px 0',
            boxShadow: theme.shadows[4],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px'
          }}
        >
          <IconButton 
            onClick={toggleSidebar}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              width: '100%',
              height: '100%'
            }}
          >
            {theme.direction === 'ltr' ? <MdChevronLeft /> : <MdChevronRight />}
          </IconButton>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <React.Fragment key={item.text}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleItemClick(item.path, !!item.subItems)}
                  sx={{
                    minHeight: 48,
                    justifyContent: isOpen ? 'initial' : 'center',
                    px: 2.5,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isOpen ? 3 : 'auto',
                      justifyContent: 'center',
                      color: theme.palette.text.primary,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      opacity: isOpen ? 1 : 0,
                      flexGrow: 1
                    }} 
                  />
                  {item.subItems && isOpen && (
                    <Box sx={{ ml: 2 }}>
                      {expandedItem === item.path ? (
                        <MdExpandLess />
                      ) : (
                        <MdExpandMore />
                      )}
                    </Box>
                  )}
                </ListItemButton>
              </ListItem>

              {item.subItems && expandedItem === item.path && isOpen && (
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItemButton
                      key={subItem.text}
                      onClick={() => handleItemClick(subItem.path)}
                      sx={{
                        pl: 8,
                        minHeight: 40,
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <ListItemText 
                        primary={subItem.text} 
                        sx={{ 
                          fontSize: '0.875rem',
                          color: theme.palette.text.secondary
                        }} 
                      />
                    </ListItemButton>
                  ))}
                </List>
              )}
            </React.Fragment>
          ))}
        </List>
      </Drawer>
      <Main isOpen={isOpen}>
        {!isOpen && (
          <IconButton
            onClick={toggleSidebar}
            sx={{
              position: 'fixed',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: theme.zIndex.drawer + 1,
              backgroundColor: theme.palette.background.paper,
              borderRadius: '0 4px 4px 0',
              boxShadow: theme.shadows[4],
              width: '40px',
              height: '40px',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            {theme.direction === 'ltr' ? <MdChevronRight /> : <MdChevronLeft />}
          </IconButton>
        )}
        <Toolbar sx={{ 
          minHeight: '64px !important',
          backgroundColor: theme.palette.background.default,
        }} />
        <Box sx={{ 
          padding: theme.spacing(3),
          marginTop: theme.spacing(2),
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: isOpen ? `${drawerWidth}px` : 0,
        }}>
          {children}
        </Box>
      </Main>
    </Box>
  );
};

export default function DashboardLayoutWrapper({ children }: DashboardLayoutProps) {
  return (
    <DepositProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </DepositProvider>
  );
}
