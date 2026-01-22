import { api } from '../../api';
import { Trade } from '../../../types/trade';

export interface TradeMessage {
  id: string;
  text?: string;
  image?: string;
  sender: 'me' | 'other' | 'system';
  time: string;
  type: 'text' | 'image' | 'system';
}

export interface InitiateTradeRequest {
  cardId: string;
  amount: number;
  categoryId: string;
  // Add other necessary fields based on the flow
}

export const tradeApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTrades: build.query<Trade[], void>({
      query: () => '/trades',
      providesTags: ['Trade'],
    }),
    getTradeById: build.query<Trade, string>({
      query: (id) => `/trades/${id}`,
      providesTags: (result, error, id) => [{ type: 'Trade', id }],
    }),
    initiateTrade: build.mutation<Trade, InitiateTradeRequest>({
      query: (body) => ({
        url: '/trades',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Trade'],
    }),
    getTradeMessages: build.query<TradeMessage[], string>({
      query: (tradeId) => `/trades/${tradeId}/messages`,
    }),
    sendMessage: build.mutation<TradeMessage, { tradeId: string; text: string }>({
      query: ({ tradeId, text }) => ({
        url: `/trades/${tradeId}/messages`,
        method: 'POST',
        body: { text },
      }),
    }),
    uploadTradeImage: build.mutation<TradeMessage, { tradeId: string; formData: FormData }>({
      query: ({ tradeId, formData }) => ({
        url: `/trades/${tradeId}/messages/upload`,
        method: 'POST',
        body: formData,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTradesQuery,
  useGetTradeByIdQuery,
  useInitiateTradeMutation,
  useGetTradeMessagesQuery,
  useSendMessageMutation,
  useUploadTradeImageMutation,
} = tradeApi;
