import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardLayout } from './components/DashboardLayout';
import { DepositProvider } from './context/DepositContext';

const DashboardPage: React.FC = () => {
  return (
    <DepositProvider>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </DepositProvider>
  );
};

export default DashboardPage;
