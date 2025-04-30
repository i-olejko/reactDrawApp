import React, { useRef, useEffect, useState } from 'react';
import { floodFill } from '../utils/floodFill';
import styles from './DrawingCanvas.module.css';

const DrawingCanvas = ({
  tool, 
  color, 
  brushSize, 
  image, 
  clearCanvas, 
  setClearCanvas 
}) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);
  
  // Initialize canvas and context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas dimensions to match window size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 100; // Leave space for toolbar
      
      // Get context and set properties
      const context = canvas.getContext('2d');
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
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
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
      
      // Reset clear canvas flag
      setClearCanvas(false);
    }
  }, [clearCanvas, image, setClearCanvas]);
  
  // Draw background image on canvas
  const drawImageOnCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context || !image) return;
    
    const img = new Image();
    img.crossOrigin = "anonymous"; // Fix: set CORS mode before src
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
    };
    img.src = image;
  };
  
  // Draw line between two points with interpolation for smooth curves
  const drawLine = (start, end) => {
    if (!contextRef.current) return;
    
    contextRef.current.beginPath();
    contextRef.current.moveTo(start.x, start.y);
    contextRef.current.lineTo(end.x, end.y);
    contextRef.current.stroke();
  };
  
  // Handle start drawing
  const startDrawing = (event) => {
    event.preventDefault();
    
    if (!contextRef.current) return;
    
    // Get pointer position
    const x = event.clientX || (event.touches && event.touches[0].clientX);
    const y = event.clientY || (event.touches && event.touches[0].clientY);
    
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
    } else if (tool === 'draw') {
      // Start drawing path
      setIsDrawing(true);
      setLastPoint({ x: canvasX, y: canvasY });
    }
  };
  
  // Handle drawing movement
  const draw = (event) => {
    event.preventDefault();
    
    if (!isDrawing || tool !== 'draw' || !contextRef.current || !lastPoint) return;
    
    // Get current pointer position
    const x = event.clientX || (event.touches && event.touches[0].clientX);
    const y = event.clientY || (event.touches && event.touches[0].clientY);
    
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
    setIsDrawing(false);
    setLastPoint(null);
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
};

export default DrawingCanvas;