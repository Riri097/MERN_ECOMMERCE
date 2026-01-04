import { PRODUCTS_URL, UPLOAD_URL } from '../constants'; // Ensure UPLOAD_URL is imported if you use it, otherwise use string
import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // 1. Get All Products (with filters)
    getProducts: builder.query({
      query: ({ keyword, pageNumber, category }) => ({
        url: PRODUCTS_URL,
        params: {
          keyword,
          pageNumber,
          category,
        },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Product'],
    }),

    // 2. Get Single Product Details
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: (result, error, arg) => [{ type: 'Product', id: arg }],
    }),

    // 3. Create Product (Admin)
    createProduct: builder.mutation({
      query: (data) => ({
        url: PRODUCTS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    // 4. Update Product (Admin)
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg.productId }],
    }),

    // 5. Upload Image (Admin)
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `/api/upload`, // Or use UPLOAD_URL constant if you have it
        method: 'POST',
        body: data,
      }),
    }),

    // 6. Delete Product (Admin)
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'], // Refresh list after delete
    }),

    // 7. Create Review (User)
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg.productId }],
    }),

    // 8. Get Top Rated Products (Carousel)
    getTopProducts: builder.query({
      query: () => `${PRODUCTS_URL}/top`,
      keepUnusedDataFor: 5,
    }),

    // 9. Get Categories (Shop Sidebar)
    getCategories: builder.query({
      query: () => `${PRODUCTS_URL}/categories`,
      keepUnusedDataFor: 5,
    }),

  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation, 
  useGetTopProductsQuery,  
  useGetCategoriesQuery,
} = productsApiSlice;