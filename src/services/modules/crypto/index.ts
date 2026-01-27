import { api } from '../../api';

export interface CryptoWallet {
  id: string;
  symbol: string;
  name: string;
  price: string;
  balance: string;
  change: string;
  image?: any;
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
      query: () => 'api/v1/wallet',
    }),
    getTokens: build.query<any[], void>({
      query: () => 'api/v1/wallet/tokens',
    }),
    generateWallet: build.mutation<{ address: string }, { symbol: string }>({
      query: (body) => ({
        url: 'api/v1/wallet/generate',
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
