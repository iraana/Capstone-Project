import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Loader } from '../components/Loader';

describe('Loader Component', () => {
  describe('Rendering', () => {
    it('renders the loader spinner', () => {
      render(<Loader />);
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('renders with default size of 50', () => {
      render(<Loader />);
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toHaveStyle({ width: '50px', height: '50px' });
    });

    it('renders with custom size', () => {
      render(<Loader size={100} />);
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toHaveStyle({ width: '100px', height: '100px' });
    });

    it('renders with text when provided', () => {
      render(<Loader text="Loading data..." />);
      
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    it('does not render text when not provided', () => {
      const { container } = render(<Loader />);
      
      const textElement = container.querySelector('span');
      expect(textElement).not.toBeInTheDocument();
    });
  });

  describe('Full Screen Mode', () => {
    it('renders in fullScreen mode when prop is true', () => {
      const { container } = render(<Loader fullScreen={true} />);
      
      const fullScreenWrapper = container.querySelector('.min-h-screen');
      expect(fullScreenWrapper).toBeInTheDocument();
    });

    it('does not render in fullScreen mode by default', () => {
      const { container } = render(<Loader />);
      
      const fullScreenWrapper = container.querySelector('.min-h-screen');
      expect(fullScreenWrapper).not.toBeInTheDocument();
    });
  });
});