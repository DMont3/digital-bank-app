// src/pages/Home/components/FAQSection/FAQSection.tsx
import React from 'react';
import { Box, Typography, Container, Grid, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FAQ } from '../../../../types/common';

const faqData: FAQ[] = [
    {
        question: 'Como abrir uma conta no YFI Bank?',
        answer: 'Você pode abrir uma conta clicando no botão "Abra sua conta" no cabeçalho e seguindo as instruções.',
    },
    {
        question: 'Quais criptomoedas o YFI Bank suporta?',
        answer: 'Atualmente, suportamos Bitcoin, USDT, Ethereum, Solana, XRP, Cardano, Tron, Avalanche e Polkadot.',
    },
    {
        question: 'Como posso entrar em contato com o suporte?',
        answer: 'Você pode entrar em contato clicando no botão "Contato" no cabeçalho.',
    },
];

const FAQSection: React.FC = () => {
    return (
        <Box component="section" sx={{ backgroundColor: '#121212', color: '#ffffff', paddingY: 8 }} id="faq">
            <Container>
                <Typography variant="h2" align="center" gutterBottom color="secondary.main">
                    Perguntas Frequentes
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                    {faqData.map((faq, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                            <Accordion 
                                sx={{
                                    backgroundColor: 'rgba(30, 30, 30, 0.6)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '16px !important',
                                    mb: 2,
                                    border: '1px solid rgba(241, 196, 15, 0.1)',
                                    '&:before': {
                                        display: 'none',
                                    },
                                    '&.Mui-expanded': {
                                        border: '1px solid rgba(241, 196, 15, 0.3)',
                                        margin: '0 0 16px 0',
                                    }
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: '#f1c40f' }} />}
                                    sx={{
                                        '& .MuiAccordionSummary-content': {
                                            transition: 'all 0.3s ease',
                                        },
                                        '&.Mui-expanded': {
                                            '& .MuiAccordionSummary-content': {
                                                color: '#f1c40f',
                                            }
                                        }
                                    }}
                                >
                                    <Typography>{faq.question}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        {faq.answer}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default FAQSection;
