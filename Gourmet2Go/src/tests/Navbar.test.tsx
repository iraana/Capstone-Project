import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { Navbar } from '../components/Navbar';


const mockSignOut = vi.fn();
let mockAuthState: {
  user: { id: string; email: string } | null;
  role: 'ADMIN' | 'USER' | 'NO_ACCESS' | null;
  signOut: typeof mockSignOut;
} = {
  user: null,
  role: null,
  signOut: mockSignOut,
};

vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockAuthState,
}));

vi.mock('../store/cartStore', () => ({
  cartStore: () => ({
    items: [],
    toggleCart: vi.fn(),
  }),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: { first_name: 'Sujit', last_name: 'Test' },
    isLoading: false,
    error: null,
  }),
}));

describe('Navbar component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuthState = {
      user: null,
      role: null,
      signOut: mockSignOut,
    };
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

  
  it('shows Administration link for ADMIN users', () => {
    mockAuthState = {
      user: { id: '123', email: 'admin@saultcollege.ca' },
      role: 'ADMIN',
      signOut: mockSignOut,
    };

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('link', { name: 'Administration' })).toBeInTheDocument();
  });

  it('shows My Orders link for logged-in USER', () => {
    mockAuthState = {
      user: { id: '123', email: 'user@saultcollege.ca' },
      role: 'USER',
      signOut: mockSignOut,
    };

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('link', { name: 'My Orders' })).toBeInTheDocument();
  });

  it('does not show Administration link for regular USER', () => {
    mockAuthState = {
      user: { id: '123', email: 'user@saultcollege.ca' },
      role: 'USER',
      signOut: mockSignOut,
    };

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.queryByRole('link', { name: 'Administration' })).not.toBeInTheDocument();
  });

  it('shows Sign Out button when user is logged in', () => {
    mockAuthState = {
      user: { id: '123', email: 'user@saultcollege.ca' },
      role: 'USER',
      signOut: mockSignOut,
    };

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('button', { name: 'Sign Out' })).toBeInTheDocument();
  });

  it('displays user first name when logged in', () => {
    mockAuthState = {
      user: { id: '123', email: 'user@saultcollege.ca' },
      role: 'USER',
      signOut: mockSignOut,
    };

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Hi, Sujit/i)).toBeInTheDocument();
  });
});
