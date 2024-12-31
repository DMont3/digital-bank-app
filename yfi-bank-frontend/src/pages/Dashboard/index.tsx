import React from 'react';
import { Box } from '@mui/material';
import { Routes, Route, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import DashboardMenu from './components/DashboardMenu';
import BTC from './components/BTC';
import Negociar from './components/Negociar';

const DashboardLayout: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(45deg, #121212 30%, #1e1e1e 90%)' }}>
            <DashboardMenu />
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Outlet />
            </Box>
        </Box>
    );
};

const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <Routes>
            <Route path="/" element={<DashboardLayout />}>
                <Route index element={<BTC />} />
                <Route path="negociar" element={<Negociar />} />
            </Route>
        </Routes>
    );
};

export default DashboardPage;