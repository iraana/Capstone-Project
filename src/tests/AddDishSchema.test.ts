import { describe, it, expect } from 'vitest';
import z from 'zod';

const dishSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z
    .number("Price must be a number")
    .positive("Price must be positive")
    .refine((val) => Number((val * 100).toFixed(0)) === val * 100, "Max 2 decimal places"),
  category: z.enum(['Other', 'Soups', 'Salads', 'Sandwiches', 'Entrees', 'Desserts', 'Bowls']),
});

describe('AddDish Zod Schema Validation', () => {
  
  it('accepts valid dish data', () => {
    const validDish = {
      name: 'Caesar Salad',
      price: 12.99,
      category: 'Salads',
    };
    
    expect(() => dishSchema.parse(validDish)).not.toThrow();
  });

  it('rejects empty name', () => {
    const invalidDish = {
      name: '',
      price: 10.00,
      category: 'Soups',
    };
    
    expect(() => dishSchema.parse(invalidDish)).toThrow('Name is required');
  });

  it('rejects negative price', () => {
    const invalidDish = {
      name: 'Pasta',
      price: -5.00,
      category: 'Entrees',
    };
    
    expect(() => dishSchema.parse(invalidDish)).toThrow('Price must be positive');
  });

  it('rejects price with more than 2 decimal places', () => {
    const invalidDish = {
      name: 'Soup',
      price: 12.999,
      category: 'Soups',
    };
    
    expect(() => dishSchema.parse(invalidDish)).toThrow('Max 2 decimal places');
  });

  it('rejects invalid category', () => {
    const invalidDish = {
      name: 'Pizza',
      price: 15.00,
      category: 'InvalidCategory',
    };
    
    expect(() => dishSchema.parse(invalidDish)).toThrow();
  });

  it('accepts all valid categories', () => {
    const categories = ['Other', 'Soups', 'Salads', 'Sandwiches', 'Entrees', 'Desserts', 'Bowls'];
    
    categories.forEach(category => {
      const dish = {
        name: 'Test Dish',
        price: 10.00,
        category,
      };
      expect(() => dishSchema.parse(dish)).not.toThrow();
    });
  });

  it('accepts price with 2 decimal places', () => {
    const validDish = {
      name: 'Steak',
      price: 25.50,
      category: 'Entrees',
    };
    
    expect(() => dishSchema.parse(validDish)).not.toThrow();
  });

  it('accepts price with 0 decimal places', () => {
    const validDish = {
      name: 'Bread',
      price: 5,
      category: 'Other',
    };
    
    expect(() => dishSchema.parse(validDish)).not.toThrow();
  });
});