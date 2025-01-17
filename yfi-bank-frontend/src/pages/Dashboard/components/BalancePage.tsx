import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useAuthStore } from '../../../stores/authStore';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const BalancePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  interface BalanceData {
    total: number;
    crypto: number;
    chartData: number[];
  }

  const { user } = useAuthStore();
  const [balanceData, setBalanceData] = React.useState<BalanceData>({
    total: user?.profile?.cryptoBalances ? 
      Object.values(user.profile.cryptoBalances).reduce((sum: number, balance: number) => sum + balance, 0) : 0,
    crypto: user?.profile?.cryptoBalances ? 
      Object.values(user.profile.cryptoBalances).reduce((sum: number, balance: number) => sum + balance, 0) : 0,
    chartData: []
  });

  React.useEffect(() => {
    // Simulando chamada API
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Aqui viria a chamada real à API
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay
        
        setBalanceData({
          total: 6500,
          crypto: 1200,
          chartData: [5000, 5200, 4800, 5500, 6000, 6200, 6500]
        });
      } catch (error) {
        console.error('Erro ao carregar saldo:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Saldo (R$)',
        data: balanceData.chartData,
        borderColor: '#00bcd4',
        backgroundColor: 'rgba(0, 188, 212, 0.1)',
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#fff',
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'Evolução do Saldo',
        color: '#fff',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(value)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#fff'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff',
          callback: (value: any) => {
            return new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              maximumFractionDigits: 0
            }).format(value);
          }
        }
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Visão Geral da Conta
      </Typography>
      
      <Grid container spacing={3}>
        {/* Card de Extrato */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Extrato
              </Typography>
              {isLoading ? (
                <Box sx={{ height: 56, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6">Carregando saldo...</Typography>
                </Box>
              ) : (
                <>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(balanceData.total)}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Criptomoedas: {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(balanceData.crypto)}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Card de Últimas Transações */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Últimas Transações
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { type: 'PIX', value: 150.0, date: '01/08', icon: '💰' },
                  { type: 'Depósito', value: 500.0, date: '31/07', icon: '💳' },
                  { type: 'Saque', value: -200.0, date: '30/07', icon: '🏧' }
                ].map((transaction, index) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1,
                    borderRadius: 1,
                    bgcolor: 'background.paper'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6">{transaction.icon}</Typography>
                      <Box>
                        <Typography variant="body1">{transaction.type}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {transaction.date}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography 
                      variant="body1" 
                      color={transaction.value > 0 ? 'success.main' : 'error.main'}
                    >
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(transaction.value)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Card de Resumo de Investimentos */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumo de Investimentos
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { type: 'Bitcoin', value: 0.25, variation: '+2.5%' },
                  { type: 'Ethereum', value: 1.2, variation: '+1.8%' },
                  { type: 'USDT', value: 500.0, variation: '0.0%' }
                ].map((investment, index) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1,
                    borderRadius: 1,
                    bgcolor: 'background.paper'
                  }}>
                    <Typography variant="body1">{investment.type}</Typography>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body1">
                        {investment.value} {investment.type === 'USDT' ? '' : '₿'}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color={investment.variation.includes('+') ? 'success.main' : 'error.main'}
                      >
                        {investment.variation}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ height: 400, position: 'relative' }}>
                {isLoading ? (
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="h6">Carregando gráfico...</Typography>
                  </Box>
                ) : (
                  <Line
                    options={chartOptions}
                    data={chartData}
                    aria-label="Gráfico de evolução do saldo"
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BalancePage;
