import { api } from '../../api';

export interface CryptoWallet {
  id: string;
  symbol: string;
  name: string;
  price: string;
  balance: string;
  change: string;
  image?: any; // The existing mock uses require()
  imageUrl?: string;
  bg?: string;
  border?: string;
}

export interface CryptoBalanceSummary {
  usd: string;
  btc: string;
  change: string;
}

export const cryptoApi = api.injectEndpoints({
  endpoints: (build) => ({
    getWallets: build.query<{ summary: CryptoBalanceSummary; wallets: CryptoWallet[] }, void>({
      query: () => '/crypto/wallets',
    }),
    getTokens: build.query<any[], void>({
      query: () => '/crypto/tokens',
    }),
    generateWallet: build.mutation<{ address: string }, { symbol: string }>({
      query: (body) => ({
        url: '/crypto/wallet/generate',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetWalletsQuery,
  useGetTokensQuery,
  useGenerateWalletMutation,
} = cryptoApi;
