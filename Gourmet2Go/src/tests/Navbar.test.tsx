import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import { Navbar } from '../components/Navbar';


const mockSignOut = vi.fn();
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    role: null,
    signOut: mockSignOut,
  }),
}));


vi.mock('../store/cartStore', () => ({
  cartStore: () => ({
    items: [],
    toggleCart: vi.fn(),
  }),
}));


vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: null,
    isLoading: false,
    error: null,
  }),
}));

describe('Navbar component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Navbar with Gourmet2Go branding', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Gourmet2Go')).toBeInTheDocument();
  });

  it('displays Menu link', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    const menuLink = screen.getByRole('link', { name: 'Menu' });
    expect(menuLink).toBeInTheDocument();
  });

  it('displays Virtual Tour link', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    const tourLink = screen.getByRole('link', { name: 'Virtual Tour' });
    expect(tourLink).toBeInTheDocument();
  });

  it('shows Sign In button when user is not logged in', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    const signInButton = screen.getByRole('link', { name: 'Sign In' });
    expect(signInButton).toBeInTheDocument();
    expect(signInButton).toHaveAttribute('href', '/sign-in');
  });

  it('does not show Administration link for non-admin users', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.queryByRole('link', { name: 'Administration' })).not.toBeInTheDocument();
  });

  it('does not show My Orders link for non-logged-in users', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.queryByRole('link', { name: 'My Orders' })).not.toBeInTheDocument();
  });
});