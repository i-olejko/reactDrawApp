import React from 'react';
import { render, act } from '@testing-library/react';
import 'jest-canvas-mock';
import DrawingCanvas, { DrawingCanvasRef } from './DrawingCanvas';

describe('DrawingCanvas', () => {
    let onHistoryChange: jest.Mock;
    let ref: React.RefObject<DrawingCanvasRef | null>;

    beforeEach(() => {
        onHistoryChange = jest.fn();
        ref = React.createRef<DrawingCanvasRef | null>();
        jest.clearAllMocks();

        // Mock window dimensions
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
        Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 768 });
    });

    test('renders without crashing', () => {
        render(
            <DrawingCanvas
                tool="draw"
                color="#000000"
                brushSize={10}
                image={null}
                clearCanvas={false}
                setClearCanvas={() => { }}
                onHistoryChange={onHistoryChange}
                ref={ref}
            />
        );

        // Verify ref methods exist
        expect(ref.current).toBeTruthy();
        expect(ref.current?.undo).toBeDefined();
        expect(ref.current?.redo).toBeDefined();
        expect(ref.current?.getHistoryState).toBeDefined();
    });

    test('undo and redo can be called', () => {
        const setClearCanvas = jest.fn();

        const { rerender } = render(
            <DrawingCanvas
                tool="draw"
                color="#000000"
                brushSize={10}
                image={null}
                clearCanvas={false}
                setClearCanvas={setClearCanvas}
                onHistoryChange={onHistoryChange}
                ref={ref}
            />
        );

        // Trigger a clear to create history
        act(() => {
            rerender(
                <DrawingCanvas
                    tool="draw"
                    color="#000000"
                    brushSize={10}
                    image={null}
                    clearCanvas={true}
                    setClearCanvas={setClearCanvas}
                    onHistoryChange={onHistoryChange}
                    ref={ref}
                />
            );
        });

        // Call undo and redo - should not throw
        act(() => {
            ref.current?.undo();
            ref.current?.redo();
        });

        // If we got here without errors, the interface works
        expect(ref.current).toBeTruthy();
    });
});
