import React, { useState, useRef } from 'react';
import DrawingCanvas, { DrawingCanvasRef } from './components/DrawingCanvas';
import Toolbar from './components/Toolbar';
import Welcome from './components/Welcome';
import Sidebar from './components/Sidebar'; // Import Sidebar

function App() {
  // App state
  const [currentPage, setCurrentPage] = useState<string>('welcome'); // New state for navigation
  const [tool, setTool] = useState<string>('draw');
  const [color, setColor] = useState<string>('#000000');
  const [brushSize, setBrushSize] = useState<number>(10);
  const [image, setImage] = useState<string | null>(null);
  const [clearCanvas, setClearCanvas] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true); // State for toolbar expanded/collapsed
  const [isPinned, setIsPinned] = useState<boolean>(false); // State for toolbar pinned

  // Undo/Redo state
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  const canvasRef = useRef<DrawingCanvasRef>(null);

  // List of images in public/img (hardcoded for now, could be dynamic)
  const imageList = ['cat_t.png'];

  // Handler for navigation
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  // Handler for uploading image
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
        setCurrentPage('canvas'); // Navigate to canvas after upload
      }
    };
    reader.readAsDataURL(file);
  };

  // Handler for clearing canvas
  const handleClear = () => {
    setClearCanvas(true);
  };

  // Handler for starting with blank canvas
  const handleStartDrawing = () => {
    setImage(null);
    setCurrentPage('canvas'); // Navigate to canvas
  };

  // Handler for selecting image from dropdown
  const handleSelectImage = (imgName: string) => {
    if (!imgName) {
      setImage(null);
    } else {
      // Use relative path for GitHub Pages
      setImage(process.env.PUBLIC_URL + '/img/' + imgName);
    }
    setCurrentPage('canvas'); // Navigate to canvas after selection
  };

  // Undo/Redo handlers
  const handleUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  };

  const handleRedo = () => {
    if (canvasRef.current) {
      canvasRef.current.redo();
    }
  };

  const handleHistoryChange = (hasUndo: boolean, hasRedo: boolean) => {
    setCanUndo(hasUndo);
    setCanRedo(hasRedo);
  };

  // Main app UI
  return (
    <div className="app">
      <Sidebar onNavigate={handleNavigate} /> {/* Add Sidebar */}
      <div className="content"> {/* Wrap content in a div */}
        {currentPage === 'welcome' && (
          <Welcome
            onUploadImage={handleImageUpload}
            onStartDrawing={handleStartDrawing}
          />
        )}
        {currentPage === 'canvas' && (
          <>
            <Toolbar
              tool={tool}
              setTool={setTool}
              color={color}
              setColor={setColor}
              brushSize={brushSize}
              setBrushSize={setBrushSize}
              onClear={handleClear}
              onUploadImage={handleImageUpload}
              imageList={imageList}
              onSelectImage={handleSelectImage}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              isPinned={isPinned}
              setIsPinned={setIsPinned}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={canUndo}
              canRedo={canRedo}
            />
            <DrawingCanvas
              ref={canvasRef}
              tool={tool}
              color={color}
              brushSize={brushSize}
              image={image}
              clearCanvas={clearCanvas}
              setClearCanvas={setClearCanvas}
              onHistoryChange={handleHistoryChange}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;