import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { floodFill } from '../utils/floodFill';
import styles from './DrawingCanvas.module.css';

interface DrawingCanvasProps {
  tool: string;
  color: string;
  brushSize: number;
  image: string | null;
  clearCanvas: boolean;
  setClearCanvas: (clear: boolean) => void;
  onHistoryChange: (canUndo: boolean, canRedo: boolean) => void;
}

export interface DrawingCanvasRef {
  undo: () => void;
  redo: () => void;
  getHistoryState: () => { step: number; length: number };
}

const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(({
  tool,
  color,
  brushSize,
  image,
  clearCanvas,
  setClearCanvas,
  onHistoryChange
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

  // History state
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState<number>(-1);

  // Expose undo/redo to parent
  useImperativeHandle(ref, () => ({
    undo: () => {
      if (historyStep > 0) {
        const newStep = historyStep - 1;
        setHistoryStep(newStep);
        restoreCanvasState(history[newStep]);
        onHistoryChange && onHistoryChange(newStep > 0, newStep < history.length - 1);
      }
    },
    redo: () => {
      if (historyStep < history.length - 1) {
        const newStep = historyStep + 1;
        setHistoryStep(newStep);
        restoreCanvasState(history[newStep]);
        onHistoryChange && onHistoryChange(newStep > 0, newStep < history.length - 1);
      }
    },
    // Helper to get current history state for debugging/testing
    getHistoryState: () => ({ step: historyStep, length: history.length })
  }));

  const saveHistory = (imageData: ImageData) => {
    // If we are not at the end of history, truncate future states
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imageData);

    // Limit history size to prevent memory issues (e.g., 20 steps)
    if (newHistory.length > 20) {
      newHistory.shift();
    } else {
      // Only increment step if we didn't shift
    }

    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
    onHistoryChange && onHistoryChange(newHistory.length - 1 > 0, false);
  };

  const restoreCanvasState = (imageData: ImageData) => {
    const context = contextRef.current;
    if (context && imageData) {
      context.putImageData(imageData, 0, 0);
    }
  };

  // Initialize canvas and context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions to match available content area
    const handleResize = () => {
      // Save current content before resizing if possible? 
      // Resizing clears canvas, so simpler to just reset or redraw image.
      // For now, we keep existing behavior but might lose drawing on resize if not handled.

      // Calculate available width accounting for sidebar and content margin
      const isMobile = window.innerWidth < 768;
      const sidebarWidth = isMobile ? 0 : 80; // Sidebar is 80px when closed (default state)
      const contentPadding = 16 * 2; // var(--spacing-md) = 16px on each side

      canvas.width = window.innerWidth - sidebarWidth - contentPadding;
      canvas.height = window.innerHeight - 100; // Leave space for toolbar

      // Get context and set properties
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) return;

      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = color;
      context.lineWidth = brushSize;
      contextRef.current = context;

      // If an image exists, draw it
      if (image) {
        drawImageOnCanvas();
      } else {
        // Fill with white background
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Save initial state to history if empty
      if (history.length === 0) {
        const initialData = context.getImageData(0, 0, canvas.width, canvas.height);
        setHistory([initialData]);
        setHistoryStep(0);
        onHistoryChange && onHistoryChange(false, false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  // Update context when color or brush size changes
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = brushSize;
    }
  }, [color, brushSize]);

  // Handle clearing the canvas
  useEffect(() => {
    if (clearCanvas && contextRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = contextRef.current;

      // Clear the canvas
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);

      // If we have a background image, redraw it
      if (image) {
        drawImageOnCanvas();
      }

      // Save this clear action to history
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      saveHistory(imageData);

      // Reset clear canvas flag
      setClearCanvas(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearCanvas, image, setClearCanvas]);

  // Draw background image on canvas
  const drawImageOnCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context || !image) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Calculate dimensions to maintain aspect ratio and fit canvas
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (canvasRatio > imgRatio) {
        // Canvas is wider than image (proportionally)
        drawHeight = canvas.height;
        drawWidth = img.width * (canvas.height / img.height);
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      } else {
        // Canvas is taller than image (proportionally)
        drawWidth = canvas.width;
        drawHeight = img.height * (canvas.width / img.width);
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      // Clear canvas and draw image
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      // Save state after loading image
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      saveHistory(imageData);
    };
    img.src = image;
  };

  // Draw line between two points with interpolation for smooth curves
  const drawLine = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    if (!contextRef.current) return;

    contextRef.current.beginPath();
    contextRef.current.moveTo(start.x, start.y);
    contextRef.current.lineTo(end.x, end.y);
    contextRef.current.stroke();
  };

  // Handle start drawing
  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();

    if (!contextRef.current || !canvasRef.current) return;

    // Get pointer position
    const x = event.clientX;
    const y = event.clientY;

    if (x === undefined || y === undefined) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const canvasX = x - canvasRect.left;
    const canvasY = y - canvasRect.top;

    if (tool === 'fill') {
      // Perform flood fill
      const context = contextRef.current;
      const imageData = context.getImageData(
        0, 0, canvasRef.current.width, canvasRef.current.height
      );

      // Convert hex color to RGBA
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      floodFill(imageData, Math.floor(canvasX), Math.floor(canvasY), [r, g, b, 255], 10);
      context.putImageData(imageData, 0, 0);

      // Save history after fill
      saveHistory(imageData);

    } else if (tool === 'draw') {
      // Start drawing path
      setIsDrawing(true);
      setLastPoint({ x: canvasX, y: canvasY });
    }
  };

  // Handle drawing movement
  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();

    if (!isDrawing || tool !== 'draw' || !contextRef.current || !lastPoint || !canvasRef.current) return;

    // Get current pointer position
    const x = event.clientX;
    const y = event.clientY;

    if (x === undefined || y === undefined) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const currentPoint = {
      x: x - canvasRect.left,
      y: y - canvasRect.top
    };

    // Draw line from last point to current point
    drawLine(lastPoint, currentPoint);
    setLastPoint(currentPoint);
  };

  // Handle end drawing
  const endDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setLastPoint(null);

      // Save history after stroke
      if (contextRef.current && canvasRef.current) {
        const imageData = contextRef.current.getImageData(
          0, 0, canvasRef.current.width, canvasRef.current.height
        );
        saveHistory(imageData);
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvasContainer}
      onPointerDown={startDrawing}
      onPointerMove={draw}
      onPointerUp={endDrawing}
      onPointerOut={endDrawing}
      style={{ touchAction: 'none' }}
    />
  );
});

export default DrawingCanvas;