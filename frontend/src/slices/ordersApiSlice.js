import { apiSlice } from './apiSlice';
import { ORDERS_URL } from '../constants';

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Order'], // <- invalidate Order tag
    }),
    getMyOrders: builder.query({
      query: () => `${ORDERS_URL}/myorders`,
      providesTags: ['Order'], // <- provides Order tag
    }),
    getOrderDetails: builder.query({
      query: (id) => `${ORDERS_URL}/${id}`,
      keepUnusedDataFor: 5,
      providesTags: (result, error, id) => [{ type: 'Order', id }], // optional per-order tagging
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: 'PUT',
        body: details,
      }),
      invalidatesTags: ['Order'], // <- invalidates orders
    }),
    getOrders: builder.query({
      query: ({ pageNumber = 1, pageSize = 5 } = {}) => 
    `${ORDERS_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      providesTags: ['Order'], // <- provides Order tag
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order'], // <- invalidates orders
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetOrdersQuery, 
  useDeliverOrderMutation,
} = ordersApiSlice;
