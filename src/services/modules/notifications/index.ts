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
      query: () => 'api/v1/notifications',
    }),
    markRead: build.mutation<void, number>({
      query: (id) => ({
        url: `api/v1/notifications/${id}/read`,
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
