import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Welcome from './Welcome';

describe('Welcome Component', () => {
    const mockOnUploadImage = jest.fn();
    const mockOnStartDrawing = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the welcome title and subtitle', () => {
        render(<Welcome onUploadImage={mockOnUploadImage} onStartDrawing={mockOnStartDrawing} />);

        expect(screen.getByText(/Kids Drawing App!/i)).toBeInTheDocument();
        expect(screen.getByText(/Unleash Your Inner Artist!/i)).toBeInTheDocument();
    });

    test('renders feature circles', () => {
        render(<Welcome onUploadImage={mockOnUploadImage} onStartDrawing={mockOnStartDrawing} />);

        expect(screen.getByText('Draw')).toBeInTheDocument();
        expect(screen.getByText('Fill')).toBeInTheDocument();
        expect(screen.getByText('Upload')).toBeInTheDocument();
    });

    test('calls onStartDrawing when Start button is clicked', () => {
        render(<Welcome onUploadImage={mockOnUploadImage} onStartDrawing={mockOnStartDrawing} />);

        const startButton = screen.getByText(/Start Drawing Adventures!/i);
        fireEvent.click(startButton);

        expect(mockOnStartDrawing).toHaveBeenCalledTimes(1);
    });

    test('calls onUploadImage when file is selected', () => {
        render(<Welcome onUploadImage={mockOnUploadImage} onStartDrawing={mockOnStartDrawing} />);

        const fileInput = screen.getByLabelText(/Upload Your Art/i);
        const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

        fireEvent.change(fileInput, { target: { files: [file] } });

        expect(mockOnUploadImage).toHaveBeenCalledTimes(1);
    });
});
