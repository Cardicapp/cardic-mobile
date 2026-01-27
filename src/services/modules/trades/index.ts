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
}

export const tradeApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTrades: build.query<Trade[], void>({
      query: () => 'api/v1/trades',
      providesTags: ['Trade'],
    }),
    getTradeById: build.query<Trade, string>({
      query: (id) => `api/v1/trades/${id}`,
      providesTags: (result, error, id) => [{ type: 'Trade', id }],
    }),
    initiateTrade: build.mutation<Trade, InitiateTradeRequest>({
      query: (body) => ({
        url: 'api/v1/trades',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Trade'],
    }),
    getTradeMessages: build.query<TradeMessage[], string>({
      query: (tradeId) => `api/v1/trades/${tradeId}/messages`,
    }),
    sendMessage: build.mutation<TradeMessage, { tradeId: string; text: string }>({
      query: ({ tradeId, text }) => ({
        url: `api/v1/trades/${tradeId}/messages`,
        method: 'POST',
        body: { text },
      }),
    }),
    uploadTradeImage: build.mutation<TradeMessage, { tradeId: string; formData: FormData }>({
      query: ({ tradeId, formData }) => ({
        url: `api/v1/trades/${tradeId}/messages/upload`,
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
