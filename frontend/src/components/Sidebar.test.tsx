import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';

describe('Sidebar Component', () => {
    const mockOnNavigate = jest.fn();

    test('renders sidebar with navigation items', () => {
        render(<Sidebar onNavigate={mockOnNavigate} />);

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Canvas')).toBeInTheDocument();
    });

    test('toggles sidebar when toggle button is clicked', () => {
        render(<Sidebar onNavigate={mockOnNavigate} />);

        const toggleButton = screen.getByLabelText('Close sidebar');
        fireEvent.click(toggleButton);

        // After closing, the label might be hidden or the button aria-label changes
        expect(screen.getByLabelText('Open sidebar')).toBeInTheDocument();
    });

    test('calls onNavigate when nav item is clicked', () => {
        render(<Sidebar onNavigate={mockOnNavigate} />);

        fireEvent.click(screen.getByText('Home'));
        expect(mockOnNavigate).toHaveBeenCalledWith('welcome');

        fireEvent.click(screen.getByText('Canvas'));
        expect(mockOnNavigate).toHaveBeenCalledWith('canvas');
    });
});
