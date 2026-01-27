import { api } from '../../api';

export interface Biller {
  id: string;
  name: string;
  label: string; // e.g., 'MTN', 'Glo'
  value: string; // e.g., 'MTN', 'Glo'
}

export interface CreateBillPaymentRequest {
  recipient: string;
  amount: string;
  network: string; // or billerCode
  meterType?: string;
  // add other fields as necessary
}

export const billsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getBillCategories: build.query<any[], void>({
      query: () => 'api/v1/bills/categories',
    }),
    getBillers: build.query<Biller[], string>({
      query: (category) => `api/v1/bills/billers/${category}`,
    }),
    validateCustomer: build.mutation<any, { billerCode: string; customerId: string }>({
      query: (body) => ({
        url: 'api/v1/bills/validate',
        method: 'POST',
        body,
      }),
    }),
    createBillPayment: build.mutation<any, CreateBillPaymentRequest>({
      query: (body) => ({
        url: 'api/v1/bills/payment',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBillCategoriesQuery,
  useGetBillersQuery,
  useValidateCustomerMutation,
  useCreateBillPaymentMutation,
} = billsApi;
