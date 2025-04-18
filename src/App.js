import React, { useState } from 'react';
import DrawingCanvas from './components/DrawingCanvas';
import Toolbar from './components/Toolbar';
import Welcome from './components/Welcome';

function App() {
  // App state
  const [showWelcome, setShowWelcome] = useState(true);
  const [tool, setTool] = useState('draw');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(10);
  const [image, setImage] = useState(null);
  const [clearCanvas, setClearCanvas] = useState(false);

  // List of images in public/img (hardcoded for now, could be dynamic)
  const imageList = ['cat_t.png'];

  // Handler for uploading image
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
      setShowWelcome(false);
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
    setShowWelcome(false);
  };

  // Handler for selecting image from dropdown
  const handleSelectImage = (imgName) => {
    if (!imgName) {
      setImage(null);
    } else {
      // Use relative path for GitHub Pages
      setImage(process.env.PUBLIC_URL + '/img/' + imgName);
      setShowWelcome(false);
    }
  };

  // Main app UI
  return (
    <div className="app">
      {showWelcome ? (
        <Welcome
          onUploadImage={handleImageUpload}
          onStartDrawing={handleStartDrawing}
        />
      ) : (
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
  );
}

export default App;