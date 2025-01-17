import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { CryptoPrices } from '../types/common';

type CryptoStore = {
  cryptoPrices: CryptoPrices;
  fetchPrices: () => Promise<void>;
  lastUpdated: Date | null;
};

const useCryptoStore = create<CryptoStore>()(
  immer((set) => ({
    cryptoPrices: {
      BTC: 0,
      ETH: 0,
      XRP: 0,
      LTC: 0
    },
    lastUpdated: null,
    fetchPrices: async () => {
      try {
        // TODO: Integrar com API da Ripio para buscar preços
        const mockPrices = {
          BTC: 200000,
          ETH: 10000,
          XRP: 2.5,
          LTC: 300
        };
        
        set((state) => {
          state.cryptoPrices = mockPrices;
          state.lastUpdated = new Date();
        });
      } catch (error) {
        console.error('Erro ao buscar preços:', error);
      }
    }
  }))
);

export { useCryptoStore };
