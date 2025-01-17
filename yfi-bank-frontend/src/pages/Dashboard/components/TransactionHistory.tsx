import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  CircularProgress,
  Chip,
  Paper,
  TextField,
  MenuItem,
  Pagination,
  Stack
} from '@mui/material';
import { useAuthStore } from '../../../stores/authStore';
import { CheckCircle, Pending } from '@mui/icons-material';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import { useDepositContext, Deposit } from '../context/DepositContext';

const TransactionHistory: React.FC = () => {
  const { user } = useAuthStore();
  const { deposits, addDeposit } = useDepositContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | Deposit['status']>('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const filteredDeposits = deposits.filter(deposit => 
    filterStatus === 'all' || deposit.status === filterStatus
  );

  const paginatedDeposits = filteredDeposits.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  useEffect(() => {
    // Dados mockados mais completos
    const mockDeposits: Deposit[] = [
      {
        id: '1',
        amount: 1500,
        created_at: new Date().toISOString(),
        status: 'completed',
        method: 'PIX',
        transaction_id: 'PIX123456'
      },
      {
        id: '2',
        amount: 800,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        status: 'pending',
        method: 'TED',
        transaction_id: 'TED789012'
      },
      {
        id: '3',
        amount: 2500,
        created_at: new Date(Date.now() - 172800000).toISOString(),
        status: 'completed',
        method: 'PIX',
        transaction_id: 'PIX654321'
      },
      {
        id: '4',
        amount: 1200,
        created_at: new Date(Date.now() - 259200000).toISOString(),
        status: 'completed',
        method: 'Boleto',
        transaction_id: 'BLT987654'
      },
      {
        id: '5',
        amount: 3000,
        created_at: new Date(Date.now() - 345600000).toISOString(),
        status: 'pending',
        method: 'PIX',
        transaction_id: 'PIX321654'
      }
    ];

    // Simula um pequeno delay de carregamento
    setTimeout(() => {
      mockDeposits.forEach(deposit => addDeposit(deposit));
      setLoading(false);
    }, 1000);
  }, [addDeposit]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Histórico de Depósitos
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            select
            label="Filtrar por status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | Deposit['status'])}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="pending">Pendentes</MenuItem>
            <MenuItem value="completed">Concluídos</MenuItem>
          </TextField>
        </Stack>
      </Paper>
      
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {paginatedDeposits.map((deposit) => (
          <React.Fragment key={deposit.id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={formatCurrency(deposit.amount)}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {formatDate(deposit.created_at)}
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={deposit.status === 'pending' ? 'Pendente' : 'Concluído'}
                        color={deposit.status === 'pending' ? 'warning' : 'success'}
                        size="small"
                        icon={deposit.status === 'pending' ? <Pending /> : <CheckCircle />}
                      />
                    </Box>
                  </>
                }
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={Math.ceil(filteredDeposits.length / itemsPerPage)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default TransactionHistory;
