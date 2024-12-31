import React, { useState, ChangeEvent, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField, RadioGroup, FormControlLabel, Radio, Button, SelectChangeEvent } from '@mui/material';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import Chart from '../../../components/common/Chart/Chart';
import Table from '../../../components/common/Table/Table';
import { api } from '../../../services/api';

const Negociar = () => {
  const [selectedAsset, setSelectedAsset] = useState<string>('BTC');
  const [inputValue, setInputValue] = useState<string>('');
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [quoteCurrency, setQuoteCurrency] = useState<string>('BRL');
  const [inputCurrencyType, setInputCurrencyType] = useState<'quote' | 'base'>('quote');

  const [marketPrice, setMarketPrice] = useState<number>(0);
  const [loadingPrice, setLoadingPrice] = useState(false);

  useEffect(() => {
    const fetchMarketPrice = async () => {
      setLoadingPrice(true);
      try {
        const response = await api.get(`/market-data/${selectedAsset}/${quoteCurrency}`);
        setMarketPrice(response.data.price); // Assuming the API returns an object with a 'price' property
      } catch (error) {
        console.error('Error fetching market price:', error);
        // Handle error appropriately
      } finally {
        setLoadingPrice(false);
      }
    };

    fetchMarketPrice();
  }, [selectedAsset, quoteCurrency]);

  const handleAssetChange = (event: SelectChangeEvent) => {
    setSelectedAsset(event.target.value as string);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleOrderTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setOrderType(event.target.value as 'buy' | 'sell');
  };

  const handleQuoteCurrencyChange = (event: SelectChangeEvent) => {
    setQuoteCurrency(event.target.value as string);
  };

  const handlePercentageClick = (percentage: number) => {
    const value = parseFloat(inputValue || '0') * percentage;
    setInputValue(value.toString());
  };

  const handleInputCurrencyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputCurrencyType(event.target.value as 'quote' | 'base');
  };

  const calculateEstimatedQuantity = () => {
    const value = parseFloat(inputValue || '0');
    if (isNaN(value) || marketPrice === 0) {
      return 0;
    }

    if (inputCurrencyType === 'quote') {
      return value / marketPrice;
    } else {
      return value;
    }
  };

  const placeOrder = async () => {
    try {
      const quantity = calculateEstimatedQuantity();
      await api.post('/orders', {
        asset: selectedAsset,
        type: orderType,
        quantity,
        price: marketPrice, // Using current market price for simplicity
        quoteCurrency,
      });
      alert('Order placed successfully!');
      // Optionally refresh order history
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order.');
    }
  };

  return (
    <Box>
      <Box>
        <Typography variant="h6" gutterBottom>
          Negociar
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="asset-select-label">Selecionar Ativo</InputLabel>
            <Select
              labelId="asset-select-label"
              id="asset-select"
              value={selectedAsset}
              label="Selecionar Ativo"
              onChange={handleAssetChange}
            >
              <MenuItem value="BTC">BTC</MenuItem>
              <MenuItem value="ETH">ETH</MenuItem>
              <MenuItem value="USDT">USDT</MenuItem>
            </Select>
          </FormControl>
          {selectedAsset && (
            <Box>
              <Chart
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                  datasets: [
                    {
                      label: `${selectedAsset} Price`,
                      data: [65, 59, 80, 81, 56, 55, 40],
                      borderColor: 'primary',
                      backgroundColor: 'primary',
                    },
                  ],
                }}
                title={`${selectedAsset}/${quoteCurrency.toUpperCase()}`}
              />
            </Box>
          )}
        </Box>
        <Box sx={{ mt: 3 }}>
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="order type"
              name="order-type"
              value={orderType}
              onChange={handleOrderTypeChange}
            >
              <FormControlLabel value="buy" control={<Radio />} label="Comprar" />
              <FormControlLabel value="sell" control={<Radio />} label="Vender" />
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <RadioGroup
              row
              aria-label="input currency"
              name="input-currency"
              value={inputCurrencyType}
              onChange={handleInputCurrencyChange}
            >
              <FormControlLabel value="base" control={<Radio />} label={selectedAsset} />
              <FormControlLabel value="quote" control={<Radio />} label={quoteCurrency.toUpperCase()} />
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 1 }}>
            <TextField
              label={`Valor em ${inputCurrencyType === 'quote' ? quoteCurrency.toUpperCase() : selectedAsset}`}
              variant="outlined"
              value={inputValue}
              onChange={handleInputChange}
            />
          </FormControl>
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
            <CustomButton variant="outlined" size="small" onClick={() => handlePercentageClick(0.25)}>25%</CustomButton>
            <CustomButton variant="outlined" size="small" onClick={() => handlePercentageClick(0.50)}>50%</CustomButton>
            <CustomButton variant="outlined" size="small" onClick={() => handlePercentageClick(0.75)}>75%</CustomButton>
            <CustomButton variant="outlined" size="small" onClick={() => handlePercentageClick(1)}>100%</CustomButton>
          </Box>

          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="quote-currency-select-label">Moeda de Cotação</InputLabel>
            <Select
              labelId="quote-currency-select-label"
              id="quote-currency-select"
              value={quoteCurrency}
              label="Moeda de Cotação"
              onChange={handleQuoteCurrencyChange}
            >
              <MenuItem value="BRL">BRL</MenuItem>
              <MenuItem value="USDT">USDT</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="subtitle2" mt={1}>
            Preço de mercado: {marketPrice} {quoteCurrency.toUpperCase()}
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Preço Limite (Opcional)"
            variant="outlined"
            fullWidth
          // value={price}
          // onChange={handlePriceChange}
          />
        </Box>

        <Typography variant="subtitle1" mt={2}>
          Quantidade Estimada: {calculateEstimatedQuantity()} {selectedAsset}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={placeOrder}
        >
          {orderType === 'buy' ? 'Comprar' : 'Vender'} {selectedAsset}
        </Button>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Histórico de Ordens
        </Typography>
        <Table
          data={[
            { ativo: 'BTC', tipo: 'Compra', preco: '150,000 BRL', quantidade: '0.001', data: 'Hoje' },
            { ativo: 'ETH', tipo: 'Venda', preco: '10,000 BRL', quantidade: '0.02', data: 'Ontem' },
          ]}
          columns={[
            { key: 'ativo', label: 'Ativo' },
            { key: 'tipo', label: 'Tipo' },
            { key: 'preco', label: 'Preço' },
            { key: 'quantidade', label: 'Quantidade' },
            { key: 'data', label: 'Data' },
          ]}
        />
      </Box>
    </Box>
  );
}
export default Negociar;

