import React, { useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField, useTheme } from '@mui/material';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import Chart from '../../../components/common/Chart/Chart';
import Table from '../../../components/common/Table/Table';

interface Order {
  type: string;
  pair: string;
  quantity: string;
  price: string;
  date: string;
}

const BTC = () => {
  const theme = useTheme();
  const [selectedCurrency, setSelectedCurrency] = useState('BRL');
  const [action, setAction] = useState('COMPRAR');

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        BTC (Visão Geral do Dashboard)
      </Typography>
      <Chart
        data={{
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [
            {
              label: 'BTC-BRL',
              data: [65, 59, 80, 81, 56, 55, 40],
              borderColor: 'primary',
              backgroundColor: 'primary',
            },
          ],
        }}
        title="Visualizar Gráfico BTC-BRL"
      />
      <Box sx={{ mt: 2, '& > button': { mr: 1 } }}>
        <CustomButton variant="contained" color="primary" onClick={() => setAction('COMPRAR')}>
          COMPRAR
        </CustomButton>
        <CustomButton variant="contained" color="primary" onClick={() => setAction('VENDER')}>
          VENDER
        </CustomButton>
        <CustomButton variant="contained" color="primary" onClick={() => setAction('CONVERTER')}>
          CONVERTER
        </CustomButton>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1">{action} BTC</Typography>
        <FormControl fullWidth sx={{ mt: 1 }}>
          <InputLabel id="currency-select-label">Qual moeda?</InputLabel>
          <Select
            labelId="currency-select-label"
            id="currency-select"
            value={selectedCurrency}
            label="Qual moeda?"
            onChange={(e) => setSelectedCurrency(e.target.value as string)}
          >
            <MenuItem value="BRL">BRL</MenuItem>
            <MenuItem value="USDT">USDT</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <TextField
            label={`Valor em ${selectedCurrency}`}
            variant="outlined"
          />
        </FormControl>
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
          <CustomButton variant="outlined" size="small" color="primary">25%</CustomButton>
          <CustomButton variant="outlined" size="small" color="primary">50%</CustomButton>
          <CustomButton variant="outlined" size="small" color="primary">75%</CustomButton>
          <CustomButton variant="outlined" size="small" color="primary">100%</CustomButton>
        </Box>
        <Typography variant="subtitle2" mt={1}>
          Cotação estimada: {/* Placeholder */}
        </Typography>
        <CustomButton variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          {action} BTC
        </CustomButton>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1">Ordens Executadas BTC</Typography>
        <Table
          columns={[
            { label: 'Tipo', key: 'type' },
            { label: 'Par', key: 'pair' },
            { label: 'Quantidade', key: 'quantity' },
            { label: 'Preço', key: 'price' },
            { label: 'Data', key: 'date' },
          ]}
          data={[
            { type: 'Compra', pair: 'BTC/BRL', quantity: '0.001', price: '150.000', date: 'Hoje' },
            { type: 'Venda', pair: 'BTC/BRL', quantity: '0.002', price: '152.000', date: 'Ontem' },
          ]}
        />
      </Box>
    </Box>
  );
};

export default BTC;
