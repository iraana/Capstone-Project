import { describe, it, expect } from 'vitest';
import { z } from 'zod';


const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});

describe('SignUp Zod Schema Validation', () => {
  
  it('accepts valid sign-up data', () => {
    const validData = {
      email: '40404040@saultcollege.ca',
      password: 'Password123!',
      first_name: 'John',
      last_name: 'Doe',
    };
    
    expect(() => signUpSchema.parse(validData)).not.toThrow();
  });

  it('rejects invalid email format', () => {
    const invalidData = {
      email: 'not-an-email',
      password: 'Password123!',
      first_name: 'John',
      last_name: 'Doe',
    };
    
    expect(() => signUpSchema.parse(invalidData)).toThrow('Invalid email address');
  });

  it('rejects password shorter than 8 characters', () => {
    const invalidData = {
      email: 'test@saultcollege.ca',
      password: 'Pass1!',
      first_name: 'John',
      last_name: 'Doe',
    };
    
    expect(() => signUpSchema.parse(invalidData)).toThrow('Password must be at least 8 characters');
  });

  it('rejects password without a number', () => {
    const invalidData = {
      email: 'test@saultcollege.ca',
      password: 'Password!',
      first_name: 'John',
      last_name: 'Doe',
    };
    
    expect(() => signUpSchema.parse(invalidData)).toThrow('Password must contain at least one number');
  });

  it('rejects password without a lowercase letter', () => {
    const invalidData = {
      email: 'test@saultcollege.ca',
      password: 'PASSWORD123!',
      first_name: 'John',
      last_name: 'Doe',
    };
    
    expect(() => signUpSchema.parse(invalidData)).toThrow('Password must contain at least one lowercase letter');
  });

  it('rejects password without an uppercase letter', () => {
    const invalidData = {
      email: 'test@saultcollege.ca',
      password: 'password123!',
      first_name: 'John',
      last_name: 'Doe',
    };
    
    expect(() => signUpSchema.parse(invalidData)).toThrow('Password must contain at least one uppercase letter');
  });

  it('rejects password without a special character', () => {
    const invalidData = {
      email: 'test@saultcollege.ca',
      password: 'Password123',
      first_name: 'John',
      last_name: 'Doe',
    };
    
    expect(() => signUpSchema.parse(invalidData)).toThrow('Password must contain at least one special character');
  });

  it('rejects empty first name', () => {
    const invalidData = {
      email: 'test@saultcollege.ca',
      password: 'Password123!',
      first_name: '',
      last_name: 'Doe',
    };
    
    expect(() => signUpSchema.parse(invalidData)).toThrow('First name is required');
  });

  it('rejects empty last name', () => {
    const invalidData = {
      email: 'test@saultcollege.ca',
      password: 'Password123!',
      first_name: 'John',
      last_name: '',
    };
    
    expect(() => signUpSchema.parse(invalidData)).toThrow('Last name is required');
  });

  it('accepts password with all requirements', () => {
    const validPasswords = [
      'Password123!',
      'MyP@ssw0rd',
      'Secure#Pass1',
      'Complex$Pass9',
    ];

    validPasswords.forEach(password => {
      const data = {
        email: 'test@saultcollege.ca',
        password,
        first_name: 'John',
        last_name: 'Doe',
      };
      expect(() => signUpSchema.parse(data)).not.toThrow();
    });
  });

  it('accepts various valid email formats', () => {
    const validEmails = [
      'user@saultcollege.ca',
      '12345678@saultcollege.ca',
      'test.user@saultcollege.ca',
      'user+tag@saultcollege.ca',
    ];

    validEmails.forEach(email => {
      const data = {
        email,
        password: 'Password123!',
        first_name: 'John',
        last_name: 'Doe',
      };
      expect(() => signUpSchema.parse(data)).not.toThrow();
    });
  });
});