import React, { useState, useCallback } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./App.css"; // Import custom CSS

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type.startsWith("image/") || selectedFile.type.startsWith("video/"))) {
      setFile(selectedFile);
      setError(null);
    } else {
      alert("Please upload an image or video file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("An error occurred while processing the file. Please try again.");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type.startsWith("image/") || droppedFile.type.startsWith("video/"))) {
      setFile(droppedFile);
      setError(null);
    } else {
      alert("Please upload an image or video file.");
    }
  }, []);

  const clearFile = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <h1 className="display-4 mb-4">Deepfake Detection</h1>
          <p className="lead">Upload or drop a document to check if it's a deepfake.</p>

          {/* Drag-and-Drop Area */}
          <div
            className={`drop-zone ${isDragOver ? "drag-over" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {file ? (
              <p className="mb-0">Selected file: <strong>{file.name}</strong></p>
            ) : (
              <p className="mb-0">Drag and drop a file here or click to select</p>
            )}
            <input
              type="file"
              onChange={handleFileChange}
              accept="video/*,image/*"
              className="d-none"
              id="fileInput"
            />
            <label htmlFor="fileInput" className="btn btn-outline-primary mt-3">
              Choose File
            </label>
          </div>

          {/* Clear File Button */}
          {file && (
            <button onClick={clearFile} className="btn btn-outline-danger mt-3">
              Clear File
            </button>
          )}

          {/* Upload Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-primary btn-lg mt-4"
            disabled={loading || !file}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : (
              "Upload"
            )}
          </button>

          {/* Progress Bar */}
          {loading && (
            <div className="progress mt-3">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${uploadProgress}%` }}
                aria-valuenow={uploadProgress}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {uploadProgress}%
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger mt-4">
              {error}
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="mt-4">
              <h2>Result:</h2>
              <div className={`alert ${result.is_deepfake ? "alert-danger" : "alert-success"}`}>
                {result.is_deepfake ? "Deepfake Detected!" : "No Deepfake Detected."}
                <br />
                Confidence: {result.confidence.toFixed(2)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;