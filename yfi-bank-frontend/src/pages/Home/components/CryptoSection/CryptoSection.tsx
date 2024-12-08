// src/pages/Home/components/CryptoSection/CryptoSection.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Card, CardMedia, CircularProgress } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { CoinInfo, CryptoData, SliderSettings } from '../../../../types/common';

// Importação dos ícones das criptomoedas
import bitcoinIcon from '../../../../assets/crypto/bitcoin.png';
import ethereumIcon from '../../../../assets/crypto/ethereum.png';
import solanaIcon from '../../../../assets/crypto/solana.png';
import xrpIcon from '../../../../assets/crypto/xrp.png';
import cardanoIcon from '../../../../assets/crypto/cardano.png';
import tronIcon from '../../../../assets/crypto/tron.png';
import avalancheIcon from '../../../../assets/crypto/avalanche.png';
import polkadotIcon from '../../../../assets/crypto/polkadot.png';

const RETRY_DELAY = 2000;

const coinIds: CoinInfo[] = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', icon: bitcoinIcon },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: ethereumIcon },
    { id: 'solana', name: 'Solana', symbol: 'SOL', icon: solanaIcon },
    { id: 'ripple', name: 'XRP', symbol: 'XRP', icon: xrpIcon },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', icon: cardanoIcon },
    { id: 'tron', name: 'Tron', symbol: 'TRX', icon: tronIcon },
    { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX', icon: avalancheIcon },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', icon: polkadotIcon }
];

const fetchWithRetry = async (url: string, retries = 3): Promise<Response> => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                return response;
            }
            
            if (response.status === 429) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                continue;
            }
            
            throw new Error(`HTTP error! status: ${response.status}`);
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
    }
    throw new Error('Max retries reached');
};

const CryptoSection: React.FC = () => {
    const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCryptoData = async () => {
            try {
                const ids = coinIds.map(coin => coin.id).join(',');
                const response = await fetchWithRetry(
                    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
                );
                
                if (!response.ok) {
                    throw new Error('Falha ao carregar dados');
                }
                
                const data = await response.json();
                
                const results = coinIds.map(coin => {
                    const coinData = data[coin.id];
                    if (!coinData) {
                        console.error(`Dados não encontrados para ${coin.name}`);
                        return null;
                    }
                    return {
                        name: coin.name,
                        symbol: coin.symbol,
                        icon: coin.icon,
                        price: coinData.usd.toLocaleString('en-US', { 
                            style: 'currency', 
                            currency: 'USD' 
                        }),
                        variation: coinData.usd_24h_change?.toFixed(2) || '0.00',
                    };
                }).filter((item): item is CryptoData => item !== null);

                setCryptoData(results);
                setLoading(false);
            } catch (err) {
                console.error('Erro ao buscar dados:', err);
                setError('Falha ao carregar os dados das criptomoedas.');
                setLoading(false);
            }
        };

        fetchCryptoData();
        
        const interval = setInterval(fetchCryptoData, 120000);
        return () => clearInterval(interval);
    }, []);

    const settings: SliderSettings = {
        dots: false,
        infinite: true,
        speed: 5000,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 0,
        cssEase: "linear",
        pauseOnHover: true,
        swipe: false,
        adaptiveHeight: true,
        variableWidth: true,
        waitForAnimate: true,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 960,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    return (
        <Box
            component="section"
            sx={{
                backgroundColor: '#121212',
                textAlign: 'center', 
                paddingY: 8,
                marginBottom: { xs: 4, sm: 8 },
                overflow: 'hidden',
            }}
            id="cryptomarket"
        >
            <Container maxWidth={false} sx={{ px: { xs: 0, sm: 2 } }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <Box sx={{ 
                        mx: -2,
                        '.slick-track': {
                            display: 'flex',
                            alignItems: 'center',
                        },
                        '.slick-slide': {
                            opacity: 0.7,
                            transition: 'opacity 0.3s ease',
                        },
                        '.slick-slide.slick-active': {
                            opacity: 1,
                        }
                    }}>
                        <Slider {...settings}>
                            {[...cryptoData, ...cryptoData].map((crypto, index) => (
                                <Box key={index} padding={2}>
                                    <Card
                                        sx={{
                                            backgroundColor: 'rgba(30, 30, 30, 0.8)',
                                            backdropFilter: 'blur(10px)',
                                            borderRadius: '16px',
                                            height: { xs: '120px', sm: '80px' },
                                            padding: '8px 16px',
                                            boxSizing: 'border-box',
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: { xs: '240px', sm: '270px' },
                                            margin: '0 auto',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                backgroundColor: 'rgba(30, 30, 30, 0.9)',
                                            }
                                        }}
                                    >
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            width: '100%',
                                            position: 'relative',
                                        }}>
                                            <CardMedia
                                                component="img"
                                                height="40"
                                                width="40"
                                                image={crypto.icon}
                                                alt={crypto.name}
                                                sx={{ 
                                                    objectFit: 'contain',
                                                    flexShrink: 0,
                                                    width: '40px',
                                                    position: 'absolute',
                                                    left: '0px',
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'flex-start',
                                                    justifyContent: 'center',
                                                    marginLeft: '50px',
                                                    width: '100%',
                                                }}
                                            >
                                                <Typography
                                                    variant="body1"
                                                    color="secondary.main"
                                                    sx={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center',
                                                        marginLeft: 0
                                                    }}
                                                >
                                                    {crypto.name}
                                                    <Typography 
                                                        variant="caption" 
                                                        sx={{ 
                                                            color: 'grey.500', 
                                                            marginLeft: '4px',
                                                            marginTop: 0
                                                        }}
                                                    >
                                                        {crypto.symbol}
                                                    </Typography>
                                                </Typography>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center',
                                                    marginTop: '4px'
                                                }}>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.primary"
                                                        sx={{ marginRight: '8px' }}
                                                    >
                                                        {crypto.price}
                                                    </Typography>
                                                    {parseFloat(crypto.variation) >= 0 ? (
                                                        <ArrowUpwardIcon
                                                            sx={{
                                                                color: 'success.main',
                                                                fontSize: '1rem',
                                                                marginRight: '4px',
                                                            }}
                                                        />
                                                    ) : (
                                                        <ArrowDownwardIcon
                                                            sx={{
                                                                color: 'error.main',
                                                                fontSize: '1rem',
                                                                marginRight: '4px',
                                                            }}
                                                        />
                                                    )}
                                                    <Typography
                                                        variant="body2"
                                                        color={parseFloat(crypto.variation) >= 0 ? 'success.main' : 'error.main'}
                                                    >
                                                        {`${crypto.variation}%`}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Box>
                            ))}
                        </Slider>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default CryptoSection;
