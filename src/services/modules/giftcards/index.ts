import { api } from '../../api';

// You might usually move this to a types file
export interface GiftCard {
  id: string;
  title: string;
  subtitle: string;
  rate: string;
  numericRate: number;
  image?: any; // The existing mock uses require(), API will likely send a URL
  imageUrl?: string; 
}

export const giftCardApi = api.injectEndpoints({
  endpoints: (build) => ({
    getGiftCards: build.query<GiftCard[], void>({
      query: () => '/giftcards',
    }),
    getGiftCardCategories: build.query<string[], void>({
        query: () => '/giftcards/categories',
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGiftCardsQuery,
  useGetGiftCardCategoriesQuery
} = giftCardApi;
