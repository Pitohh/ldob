import { z } from 'zod';

// Validation schemas
const customerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20)
});

const serviceSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  price: z.number().positive(),
  duration: z.number().int().positive()
});

const productSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().min(0)
});

const appointmentSchema = z.object({
  customer_id: z.string().uuid(),
  service_id: z.string().uuid(),
  date: z.string().datetime(),
  status: z.enum(['scheduled', 'completed', 'cancelled'])
});

const saleSchema = z.object({
  customer_id: z.string().uuid(),
  items: z.array(z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().positive(),
    price: z.number().positive()
  })),
  payment_method: z.enum(['cash', 'card']),
  total: z.number().positive()
});

// Middleware factory
export const validate = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Validation Error',
      details: error.errors
    });
  }
};

export const schemas = {
  customer: customerSchema,
  service: serviceSchema,
  product: productSchema,
  appointment: appointmentSchema,
  sale: saleSchema
};