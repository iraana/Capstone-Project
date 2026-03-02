import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, useLocation } from 'react-router';
import { Footer } from '../components/Footer';


const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
};

describe('Footer component', () => {
  it('renders the Footer component', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Gourmet2Go')).toBeInTheDocument();
  });

  it('displays About link', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    
    const aboutLink = screen.getByRole('link', { name: 'About' });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('displays Privacy Policy link', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    
    const privacyLink = screen.getByRole('link', { name: 'Privacy Policy' });
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute('href', '/privacy-policy');
  });

  it('displays Terms of Service link', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    
    const tosLink = screen.getByRole('link', { name: 'Terms of Service' });
    expect(tosLink).toBeInTheDocument();
    expect(tosLink).toHaveAttribute('href', '/terms-of-service');
  });

  it('displays Contact link', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    
    const contactLink = screen.getByRole('link', { name: 'Contact' });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute('href', '/contact');
  });

  it('displays copyright text', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/© 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/All Rights Reserved/i)).toBeInTheDocument();
  });


  it('navigates to About page when About link is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <Footer />
        <LocationDisplay />
      </BrowserRouter>
    );
    
    const aboutLink = screen.getByRole('link', { name: 'About' });
    await user.click(aboutLink);
    
    expect(screen.getByTestId('location')).toHaveTextContent('/about');
  });

  it('navigates to Privacy Policy page when clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <Footer />
        <LocationDisplay />
      </BrowserRouter>
    );
    
    const privacyLink = screen.getByRole('link', { name: 'Privacy Policy' });
    await user.click(privacyLink);
    
    expect(screen.getByTestId('location')).toHaveTextContent('/privacy-policy');
  });

  it('navigates to Terms of Service page when clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <Footer />
        <LocationDisplay />
      </BrowserRouter>
    );
    
    const tosLink = screen.getByRole('link', { name: 'Terms of Service' });
    await user.click(tosLink);
    
    expect(screen.getByTestId('location')).toHaveTextContent('/terms-of-service');
  });

  it('navigates to Contact page when clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <Footer />
        <LocationDisplay />
      </BrowserRouter>
    );
    
    const contactLink = screen.getByRole('link', { name: 'Contact' });
    await user.click(contactLink);
    
    expect(screen.getByTestId('location')).toHaveTextContent('/contact');
  });

  it('navigates to home page when Gourmet2Go logo is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <Footer />
        <LocationDisplay />
      </BrowserRouter>
    );
    
    const logoLink = screen.getAllByRole('link', { name: /Gourmet2Go/i })[0];
    await user.click(logoLink);
    
    expect(screen.getByTestId('location')).toHaveTextContent('/');
  });
});