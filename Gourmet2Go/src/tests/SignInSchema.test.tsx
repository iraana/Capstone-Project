import { describe, it, expect } from 'vitest';
import { z } from 'zod';


const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

describe('SignIn Zod Schema Validation', () => {
  
  it('accepts valid sign-in data', () => {
    const validData = {
      email: '40404040@saultcollege.ca',
      password: 'Password123!',
    };
    
    expect(() => signInSchema.parse(validData)).not.toThrow();
  });

  it('rejects invalid email format', () => {
    const invalidData = {
      email: 'not-an-email',
      password: 'password123',
    };
    
    expect(() => signInSchema.parse(invalidData)).toThrow('Invalid email address');
  });

  it('rejects empty email', () => {
    const invalidData = {
      email: '',
      password: 'password123',
    };
    
    expect(() => signInSchema.parse(invalidData)).toThrow();
  });

  it('rejects empty password', () => {
    const invalidData = {
      email: 'test@saultcollege.ca',
      password: '',
    };
    
    expect(() => signInSchema.parse(invalidData)).toThrow('Password is required');
  });

  it('accepts any non-empty password', () => {
    const passwords = [
      'short',
      'NoNumbers',
      'ALLCAPS',
      'no-special',
      '12345678',
      'a',
    ];

    passwords.forEach(password => {
      const data = {
        email: 'test@saultcollege.ca',
        password,
      };
      expect(() => signInSchema.parse(data)).not.toThrow();
    });
  });

  it('accepts various valid email formats', () => {
    const validEmails = [
      'user@saultcollege.ca',
      '12345678@saultcollege.ca',
      'test.user@saultcollege.ca',
      'user+tag@gmail.com',
      'admin@example.org',
    ];

    validEmails.forEach(email => {
      const data = {
        email,
        password: 'anypassword',
      };
      expect(() => signInSchema.parse(data)).not.toThrow();
    });
  });

  it('rejects email without @ symbol', () => {
    const invalidData = {
      email: 'invalidemail.com',
      password: 'password',
    };
    
    expect(() => signInSchema.parse(invalidData)).toThrow('Invalid email address');
  });

  it('rejects email without domain', () => {
    const invalidData = {
      email: 'user@',
      password: 'password',
    };
    
    expect(() => signInSchema.parse(invalidData)).toThrow('Invalid email address');
  });
});
