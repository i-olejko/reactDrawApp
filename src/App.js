import React, { useState } from 'react';
import DrawingCanvas from './components/DrawingCanvas';
import Toolbar from './components/Toolbar';
import Welcome from './components/Welcome';
import Sidebar from './components/Sidebar'; // Import Sidebar

function App() {
  // App state
  const [currentPage, setCurrentPage] = useState('welcome'); // New state for navigation
  const [tool, setTool] = useState('draw');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(10);
  const [image, setImage] = useState(null);
  const [clearCanvas, setClearCanvas] = useState(false);

  // List of images in public/img (hardcoded for now, could be dynamic)
  const imageList = ['cat_t.png'];

  // Handler for navigation
  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  // Handler for uploading image
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
      setCurrentPage('canvas'); // Navigate to canvas after upload
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
  const handleSelectImage = (imgName) => {
    if (!imgName) {
      setImage(null);
    } else {
      // Use relative path for GitHub Pages
      setImage(process.env.PUBLIC_URL + '/img/' + imgName);
    }
    setCurrentPage('canvas'); // Navigate to canvas after selection
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
            />
            <DrawingCanvas
              tool={tool}
              color={color}
              brushSize={brushSize}
              image={image}
              clearCanvas={clearCanvas}
              setClearCanvas={setClearCanvas}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;