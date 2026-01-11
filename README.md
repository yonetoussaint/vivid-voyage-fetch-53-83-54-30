import { z } from 'zod';

// Product DTO
export const ProductSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  sellerId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

// Create Product DTO
export type CreateProductDTO = z.infer<typeof ProductSchema>;

// API Response
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}