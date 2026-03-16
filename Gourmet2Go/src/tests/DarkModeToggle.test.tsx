import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DarkModeToggle } from '../components/DarkModeToggle';

describe('DarkModeToggle Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Remove dark class from document
    document.documentElement.classList.remove('dark');
  });

  describe('Initial State', () => {
    it('renders the toggle button', () => {
      render(<DarkModeToggle />);
      
      const button = screen.getByRole('button', { name: /toggle dark mode/i });
      expect(button).toBeInTheDocument();
    });

    it('starts in light mode by default when no preference stored', () => {
      render(<DarkModeToggle />);
      
      expect(screen.getByText('Light')).toBeInTheDocument();
    });

    it('loads dark mode from localStorage when stored', () => {
      localStorage.setItem('theme', 'dark');
      
      render(<DarkModeToggle />);
      
      expect(screen.getByText('Dark')).toBeInTheDocument();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('loads light mode from localStorage when stored', () => {
      localStorage.setItem('theme', 'light');
      
      render(<DarkModeToggle />);
      
      expect(screen.getByText('Light')).toBeInTheDocument();
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('Toggle Functionality', () => {
    it('switches from light to dark mode when clicked', async () => {
      const user = userEvent.setup();
      render(<DarkModeToggle />);
      
      const button = screen.getByRole('button', { name: /toggle dark mode/i });
      
      expect(screen.getByText('Light')).toBeInTheDocument();
      
      await user.click(button);
      
      expect(screen.getByText('Dark')).toBeInTheDocument();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('switches from dark to light mode when clicked', async () => {
      const user = userEvent.setup();
      localStorage.setItem('theme', 'dark');
      
      render(<DarkModeToggle />);
      
      const button = screen.getByRole('button', { name: /toggle dark mode/i });
      
      expect(screen.getByText('Dark')).toBeInTheDocument();
      
      await user.click(button);
      
      expect(screen.getByText('Light')).toBeInTheDocument();
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('saves dark mode preference to localStorage', async () => {
      const user = userEvent.setup();
      render(<DarkModeToggle />);
      
      const button = screen.getByRole('button', { name: /toggle dark mode/i });
      await user.click(button);
      
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('saves light mode preference to localStorage', async () => {
      const user = userEvent.setup();
      localStorage.setItem('theme', 'dark');
      
      render(<DarkModeToggle />);
      
      const button = screen.getByRole('button', { name: /toggle dark mode/i });
      await user.click(button);
      
      expect(localStorage.getItem('theme')).toBe('light');
    });
  });

  describe('Accessibility', () => {
    it('has correct aria-label', () => {
      render(<DarkModeToggle />);
      
      const button = screen.getByRole('button', { name: /toggle dark mode/i });
      expect(button).toHaveAttribute('aria-label', 'Toggle dark mode');
    });

    it('updates aria-pressed when toggled', async () => {
      const user = userEvent.setup();
      render(<DarkModeToggle />);
      
      const button = screen.getByRole('button', { name: /toggle dark mode/i });
      
      expect(button).toHaveAttribute('aria-pressed', 'false');
      
      await user.click(button);
      
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });
  });
});