import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SendIcon from '@mui/icons-material/Send';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';


const navItems = [
    { label: 'Visão Geral', to: '/dashboard', icon: <AccountBalanceIcon /> },
    { label: 'Negociar', to: '/dashboard/negociar', icon: <SwapHorizIcon /> },
    { label: 'Extrato', to: '/dashboard/extrato', icon: <ReceiptIcon /> },
    { label: 'Transferências de Reais', to: '/dashboard/transferencias-de-reais', icon: <MonetizationOnIcon /> },
    { label: 'Enviar / Receber Moedas', to: '/dashboard/enviar-receber', icon: <SendIcon /> },
];
const DashboardMenu: React.FC = () => {
    const location = useLocation();

    return (
        <Box sx={{ width: 240, bgcolor: 'background.paper', height: '100%', borderRight: '1px solid rgba(241, 196, 15, 0.1)' }}>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to={item.to}
                            sx={(theme) => ({
                                '&.Mui-selected': {
                                    backgroundColor: theme.palette.secondary.light,
                                    '& .MuiListItemIcon-root': {
                                        color: theme.palette.secondary.main,
                                    },
                                },
                                '&:hover': {
                                    backgroundColor: theme.palette.secondary.light,
                                },
                            })}
                            selected={location.pathname.startsWith(item.to)}
                        >
                            <ListItemIcon color="inherit">
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default DashboardMenu;