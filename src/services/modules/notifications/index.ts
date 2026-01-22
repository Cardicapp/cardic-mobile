import { api } from '../../api';

export interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export const notificationApi = api.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query<Notification[], void>({
      query: () => '/notifications',
    }),
    markRead: build.mutation<void, number>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNotificationsQuery,
  useMarkReadMutation,
} = notificationApi;
