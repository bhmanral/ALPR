import React, { useState, useRef } from 'react';

const DD = () => {
  const [file, setFile] = useState(null);
  const [processedImage, setProcessedImage] = useState('');
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFile(event.dataTransfer.files[0]);
  };

  const handleDetect = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      setProcessedImage(data.processed_image_path);
      console.log('the processed image is as :- ',processedImage )
      alert(`successfully completed ${processedImage}`)
      setError(null);
    } catch (error) {
      alert(`error occured as ${error}`)
      console.error('Error:', error);
      setError('Error uploading file.');
      setProcessedImage(null);
    }
  };

  if (file) {
    return (
      <div className="uploads">
        <div className="actions">
          <p>ARE YOU SURE YOU WANT TO DETECT THE LICENSE PLATE FOR THIS FILE?</p>
          <button onClick={() => setFile(null)}>Cancel</button>
          <button onClick={handleDetect}>DETECT</button>
        </div>
        {processedImage && (
          <div>
            <h2>Detected License Plate</h2>
            <img
              src={`http://127.0.0.1:5000/processed_image/${processedImage.split('/').pop()}`}
              alt="Processed"
            />
          </div>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  }

  return (
    <>
      <div
        className="dropzone"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <h2 style={{ marginBottom: '10px' }}>Drag and Drop Files to Upload</h2>
        <h3 style={{ marginTop: '0.5px' }}>Or</h3>
        <input
          type="file"
          onChange={(event) => setFile(event.target.files[0])}
          hidden
          accept="image/*"
          ref={inputRef}
        />
        <button onClick={() => inputRef.current.click()}>Select Files</button>
      </div>
    </>
  );
};

export default DD;
