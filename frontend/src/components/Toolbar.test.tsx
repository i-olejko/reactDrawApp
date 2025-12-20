import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Toolbar from './Toolbar';

describe('Toolbar Component', () => {
    const mockProps = {
        tool: 'draw',
        setTool: jest.fn(),
        color: '#000000',
        setColor: jest.fn(),
        brushSize: 10,
        setBrushSize: jest.fn(),
        onClear: jest.fn(),
        onUploadImage: jest.fn(),
        imageList: [],
        onSelectImage: jest.fn(),
        isExpanded: true,
        setIsExpanded: jest.fn(),
        isPinned: false,
        setIsPinned: jest.fn(),
        onUndo: jest.fn(),
        onRedo: jest.fn(),
        canUndo: true,
        canRedo: true,
    };

    test('renders toolbar with tools and actions', () => {
        render(<Toolbar {...mockProps} />);

        // Check for tool buttons (using title attribute which is accessible)
        expect(screen.getByTitle('Draw')).toBeInTheDocument();
        expect(screen.getByTitle('Fill')).toBeInTheDocument();

        // Check for action buttons
        expect(screen.getByTitle('Undo')).toBeInTheDocument();
        expect(screen.getByTitle('Redo')).toBeInTheDocument();
        expect(screen.getByTitle('Clear Canvas')).toBeInTheDocument();
    });

    test('calls setTool when tool is selected', () => {
        render(<Toolbar {...mockProps} />);

        const fillButton = screen.getByTitle('Fill');
        fireEvent.click(fillButton);
        expect(mockProps.setTool).toHaveBeenCalledWith('fill');
    });

    test('calls onUndo and onRedo when clicked', () => {
        render(<Toolbar {...mockProps} />);

        const undoButton = screen.getByTitle('Undo');
        const redoButton = screen.getByTitle('Redo');

        fireEvent.click(undoButton);
        expect(mockProps.onUndo).toHaveBeenCalled();

        fireEvent.click(redoButton);
        expect(mockProps.onRedo).toHaveBeenCalled();
    });

    test('renders correct number of initial color swatches and mobile dropdown', () => {
        render(<Toolbar {...mockProps} />);

        // Check for color swatches
        const swatches = document.getElementsByClassName('color-swatch');
        expect(swatches.length).toBeGreaterThan(0);

        // Check for mobile color dropdown by class name
        const dropdown = document.querySelector('.mobile-color-select');
        expect(dropdown).toBeInTheDocument();

        // Check that we can select a hidden color (e.g., Pink #FFC0CB)
        // We need to trigger change event
        if (dropdown) {
            fireEvent.change(dropdown, { target: { value: '#FFC0CB' } });
            expect(mockProps.setColor).toHaveBeenCalledWith('#FFC0CB');
        }
    });
});
