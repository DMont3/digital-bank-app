import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Deposit {
  id: string;
  amount: number;
  created_at: string;
  status: 'pending' | 'completed';
  method: 'PIX' | 'TED' | 'Boleto';
  transaction_id: string;
}

interface DepositContextType {
  deposits: Deposit[];
  setDeposits: React.Dispatch<React.SetStateAction<Deposit[]>>;
  addDeposit: (deposit: Omit<Deposit, 'id' | 'created_at'>) => void;
  depositData: {
    amount: string;
  };
  setDepositData: React.Dispatch<React.SetStateAction<{
    amount: string;
  }>>;
}

const DepositContext = createContext<DepositContextType>({} as DepositContextType);

export const DepositProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [depositData, setDepositData] = useState({
    amount: '0'
  });

  const addDeposit = (deposit: Omit<Deposit, 'id' | 'created_at'>) => {
    const newDeposit: Deposit = {
      ...deposit,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    setDeposits(prev => [newDeposit, ...prev]);
  };

  return (
    <DepositContext.Provider value={{ 
      deposits, 
      setDeposits, 
      addDeposit,
      depositData,
      setDepositData
    }}>
      {children}
    </DepositContext.Provider>
  );
};

export const useDepositContext = () => {
  const context = useContext(DepositContext);
  if (!context) {
    throw new Error('useDepositContext must be used within a DepositProvider');
  }
  return context;
};
