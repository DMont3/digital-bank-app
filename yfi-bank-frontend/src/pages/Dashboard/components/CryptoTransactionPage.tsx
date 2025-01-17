import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert
} from '@mui/material';
import { ShoppingCart, Sell, History } from '@mui/icons-material';
import { useAuthStore } from '../../../stores/authStore';
import { useSnackbar } from 'notistack';
import { useCryptoStore } from '../../../stores/cryptoStore';
import { TransactionType, CryptoTransaction } from '../../../types/common';
import { formatCurrency } from '../../../utils/formatters';

const CryptoTransactionPage: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [crypto, setCrypto] = useState('BTC');
  const [transactionType, setTransactionType] = useState<TransactionType>('buy');
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<CryptoTransaction[]>([]);
  const [fee, setFee] = useState(0.01); // Taxa de 1%
  const [totalAmount, setTotalAmount] = useState(0);
  const { user } = useAuthStore();
  const { enqueueSnackbar } = useSnackbar();
  // TODO: Implementar integração real com API de preços
  const { cryptoPrices, fetchPrices } = useCryptoStore();

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  // TODO: Implementar integração real com API de transações
  const handleTransaction = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      enqueueSnackbar('Valor inválido', { variant: 'error' });
      return;
    }

    try {
      setIsLoading(true);
      
      // TODO: Verificar saldo disponível para venda via API
      if (transactionType === 'sell') {
        const cryptoBalance = user?.profile.cryptoBalances?.[crypto] || 0;
        const cryptoAmount = Number(amount) / cryptoPrices[crypto];
        if (cryptoAmount > cryptoBalance) {
          enqueueSnackbar('Saldo insuficiente', { variant: 'error' });
          return;
        }
      }

      // TODO: Substituir por chamada real à API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay de rede
      
      // Mock de transação - TODO: Remover após implementação real
      const transaction: CryptoTransaction = {
        id: Math.random().toString(36).substr(2, 9),
        type: transactionType,
        crypto,
        amount: Number(amount),
        price: cryptoPrices[crypto],
        date: new Date().toISOString(),
        status: 'completed'
      };
      
      setTransactions(prev => [transaction, ...prev]);
      
      // TODO: Atualizar saldos via API
      // Atualiza saldos mockados - Remover após implementação real
      if (transactionType === 'buy') {
        user!.profile.cryptoBalances = {
          ...user!.profile.cryptoBalances,
          [crypto]: (user!.profile.cryptoBalances?.[crypto] || 0) + (Number(amount) / cryptoPrices[crypto])
        };
      } else {
        user!.profile.cryptoBalances = {
          ...user!.profile.cryptoBalances,
          [crypto]: (user!.profile.cryptoBalances?.[crypto] || 0) - (Number(amount) / cryptoPrices[crypto])
        };
      }
      
      enqueueSnackbar('Transação realizada com sucesso!', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Erro ao processar transação', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {transactionType === 'buy' ? 'Comprar' : 'Vender'} Criptomoeda
      </Typography>

      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="crypto-select-label">Criptomoeda</InputLabel>
          <Select
            labelId="crypto-select-label"
            value={crypto}
            label="Criptomoeda"
            onChange={(e) => setCrypto(e.target.value as string)}
          >
            <MenuItem value="BTC">Bitcoin (BTC)</MenuItem>
            <MenuItem value="ETH">Ethereum (ETH)</MenuItem>
            <MenuItem value="XRP">Ripple (XRP)</MenuItem>
            <MenuItem value="LTC">Litecoin (LTC)</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Valor em BRL"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          margin="normal"
          InputProps={{
            startAdornment: 'R$',
          }}
        />

        {cryptoPrices && cryptoPrices[crypto] && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            1 {crypto} = R$ {cryptoPrices[crypto].toFixed(2)}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            fullWidth
            variant={transactionType === 'buy' ? 'contained' : 'outlined'}
            onClick={() => setTransactionType('buy')}
            startIcon={transactionType === 'buy' ? <ShoppingCart /> : null}
          >
            Comprar
          </Button>
          <Button
            fullWidth
            variant={transactionType === 'sell' ? 'contained' : 'outlined'}
            onClick={() => setTransactionType('sell')}
            startIcon={transactionType === 'sell' ? <Sell /> : null}
          >
            Vender
          </Button>
        </Box>

        {user?.profile.cryptoBalances?.[crypto] && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Saldo disponível: {user.profile.cryptoBalances[crypto].toFixed(6)} {crypto}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleTransaction}
          disabled={isLoading || !amount}
          sx={{ mt: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Confirmar Transação'}
        </Button>

        {totalAmount > 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Valor total: {formatCurrency(totalAmount)} (incluindo taxa de {fee * 100}%)
          </Alert>
        )}
      </Box>

      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <History /> Histórico de Transações
        </Typography>
        
        {transactions.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Cripto</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{new Date(tx.date).toLocaleString()}</TableCell>
                    <TableCell>{tx.type === 'buy' ? 'Compra' : 'Venda'}</TableCell>
                    <TableCell>{tx.crypto}</TableCell>
                    <TableCell>{formatCurrency(tx.amount)}</TableCell>
                    <TableCell>
                      <Typography 
                        color={tx.status === 'completed' ? 'success.main' : 'error.main'}
                      >
                        {tx.status === 'completed' ? 'Concluído' : 'Erro'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Nenhuma transação realizada ainda
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default CryptoTransactionPage;
