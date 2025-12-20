import React from 'react';
import { render, act } from '@testing-library/react';
import 'jest-canvas-mock';
import DrawingCanvas from './DrawingCanvas';

describe('DrawingCanvas', () => {
    let onHistoryChange;
    let ref;

    beforeEach(() => {
        onHistoryChange = jest.fn();
        ref = React.createRef();
        jest.clearAllMocks();
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
    });

    test('initializes history on mount', () => {
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

        expect(onHistoryChange).toHaveBeenCalledWith(false, false);
        // We can't easily check internal history state without exposing it or checking context calls
        // But initialization calls getImageData
        // With jest-canvas-mock, we can check context calls if we get the context
        // The component uses ref to get canvas, then getContext.
        // We can spy on the context methods if we can access the context instance.
        // jest-canvas-mock makes getContext return a consistent mock object for the same canvas.
    });

    test('undo and redo functionality', () => {
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

        // Trigger a clear to save history
        const { rerender } = render(
            <DrawingCanvas
                tool="draw"
                color="#000000"
                brushSize={10}
                image={null}
                clearCanvas={true}
                setClearCanvas={() => { }}
                onHistoryChange={onHistoryChange}
                ref={ref}
            />
        );

        expect(onHistoryChange).toHaveBeenLastCalledWith(true, false);

        // Test Undo
        act(() => {
            if (ref.current) ref.current.undo();
        });
        expect(onHistoryChange).toHaveBeenLastCalledWith(false, true);

        // Test Redo
        act(() => {
            if (ref.current) ref.current.redo();
        });
        expect(onHistoryChange).toHaveBeenLastCalledWith(true, false);
    });
});
