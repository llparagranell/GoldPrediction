import { create } from 'zustand';

interface MarketState {
  symbol: string;
  price: number;
  bids: number[][];
  asks: number[][];
  indicators: any;
  prediction: any;
  sentiment: any;
  setMarketData: (data: any) => void;
  setSentiment: (data: any) => void;
  setSymbol: (symbol: string) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  symbol: 'PAXGUSDT',
  price: 0,
  bids: [],
  asks: [],
  indicators: {},
  prediction: {},
  sentiment: {},
  setMarketData: (data) => set({
    symbol: data.symbol?.toUpperCase() || 'PAXGUSDT',
    bids: data.bids,
    asks: data.asks,
    indicators: data.indicators,
    prediction: data.prediction,
    price: data.bids[0]?.[0] || 0
  }),
  setSentiment: (data) => set({ sentiment: data }),
  setSymbol: (symbol) => set({ symbol })
}));

interface AuthState {
  user: any;
  token: string | null;
  setAuth: (user: any, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  }
}));
