import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('deepfakeAnalysisHistory');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setAnalysisHistory(parsed);
        }
      }
    } catch (error) {
      console.error("Error loading history:", error);
      localStorage.removeItem('deepfakeAnalysisHistory');
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('deepfakeAnalysisHistory', JSON.stringify(analysisHistory));
    } catch (error) {
      console.error("Error saving history:", error);
    }
  }, [analysisHistory]);

  const validateFile = (file) => {
    if (!file) return "No file selected";
    
    // Check file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return "File size must be less than 100MB";
    }
    
    // Check file type
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm'];
    
    if (!allowedImageTypes.includes(file.type) && !allowedVideoTypes.includes(file.type)) {
      return "Please upload an image (JPG, PNG, BMP, WebP) or video (MP4, AVI, MOV, MKV, WebM) file";
    }
    
    return null; // File is valid
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validationError = validateFile(selectedFile);
    
    if (validationError) {
      setError(validationError);
      setFile(null);
      setFilePreview(null);
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    createFilePreview(selectedFile);
  };

  const createFilePreview = (file) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreview(e.target.result);
    };
    reader.onerror = () => {
      setError("Failed to preview file. Please try again.");
      setFilePreview(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 300000, // 5 minutes timeout
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });
      
      const analysisResult = {
        ...response.data,
        timestamp: new Date().toISOString(),
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      };
      
      setResult(analysisResult);
      setAnalysisHistory(prev => [analysisResult, ...prev.slice(0, 9)]); // Keep last 10
    } catch (error) {
      console.error("Error uploading file:", error);
      let errorMessage = "An error occurred while processing the file. Please try again.";
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
      } else if (error.request) {
        // Network error
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = "Request timed out. Please try with a smaller file.";
      }
      
      setError(errorMessage);
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
    
    if (!droppedFile) {
      setError("No file was dropped");
      return;
    }
    
    const validationError = validateFile(droppedFile);
    if (validationError) {
      setError(validationError);
      setFile(null);
      setFilePreview(null);
      return;
    }
    
    setFile(droppedFile);
    setError(null);
    createFilePreview(droppedFile);
  }, []);

  const clearFile = () => {
    setFile(null);
    setResult(null);
    setFilePreview(null);
    setError(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'danger';
  };

  const getConfidenceText = (confidence) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  const clearHistory = () => {
    setAnalysisHistory([]);
    localStorage.removeItem('deepfakeAnalysisHistory');
  };

  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-8">
          {/* Header */}
          <div className="text-center py-5">
            <h1 className="display-4 fw-bold text-primary mb-3">
              <i className="fas fa-shield-alt me-3"></i>
                Satyam - A deepfake detection system
            </h1>
            <p className="lead text-muted">
              Advanced AI-powered detection for images and videos. Upload your media to analyze authenticity.
            </p>
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button 
                className={`btn ${showHistory ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setShowHistory(!showHistory)}
              >
                <i className="fas fa-history me-2"></i>
                Analysis History
              </button>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => window.open('https://huggingface.co/dima806/deepfake_vs_real_image_detection', '_blank')}
              >
                <i className="fas fa-info-circle me-2"></i>
                About Model
              </button>
            </div>
          </div>

          {/* History Panel */}
          {showHistory && (
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fas fa-history me-2"></i>
                  Recent Analysis History
                </h5>
                {analysisHistory.length > 0 && (
                  <button 
                    className="btn btn-sm btn-outline-light"
                    onClick={clearHistory}
                    title="Clear History"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                )}
              </div>
              <div className="card-body">
                {analysisHistory.length === 0 ? (
                  <p className="text-muted text-center">No analysis history yet.</p>
                ) : (
                  <div className="row">
                    {analysisHistory.map((item, index) => (
                      <div key={index} className="col-md-6 col-lg-4 mb-3">
                        <div className="card h-100 border-0 shadow-sm">
                          <div className="card-body p-3">
                            <div className="d-flex align-items-center mb-2">
                              <i className={`fas fa-${item.type === 'image' ? 'image' : 'video'} text-primary me-2`}></i>
                              <small className="text-muted">{new Date(item.timestamp).toLocaleDateString()}</small>
                            </div>
                            <h6 className="card-title text-truncate mb-2">{item.fileName}</h6>
                            <div className={`badge bg-${item.is_deepfake ? 'danger' : 'success'} mb-2`}>
                              {item.is_deepfake ? 'Deepfake' : 'Real'}
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">{formatFileSize(item.fileSize)}</small>
                              <small className={`text-${getConfidenceColor(item.confidence)}`}>
                                {Math.round(item.confidence * 100)}% confidence
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Upload Area */}
          <div className="card shadow-lg border-0">
            <div className="card-body p-5">
              {/* File Preview */}
              {filePreview && (
                <div className="text-center mb-4">
                  <div className="position-relative d-inline-block">
                    {file.type.startsWith("image/") ? (
                      <img 
                        src={filePreview} 
                        alt="Preview" 
                        className="img-fluid rounded shadow-sm" 
                        style={{ maxHeight: '300px', maxWidth: '100%' }}
                        onError={() => setError("Failed to load image preview")}
                      />
                    ) : (
                      <video 
                        src={filePreview} 
                        controls 
                        className="img-fluid rounded shadow-sm" 
                        style={{ maxHeight: '300px', maxWidth: '100%' }}
                        onError={() => setError("Failed to load video preview")}
                      />
                    )}
                    <button 
                      onClick={clearFile}
                      className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                      style={{ zIndex: 10 }}
                      title="Remove File"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="mt-3">
                    <h6 className="mb-1">{file.name}</h6>
                    <small className="text-muted">
                      {formatFileSize(file.size)} • {file.type}
                    </small>
                  </div>
                </div>
              )}

              {/* Drag-and-Drop Area */}
              {!filePreview && (
                <div
                  className={`drop-zone ${isDragOver ? "drag-over" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="text-center">
                    <i className="fas fa-cloud-upload-alt fa-3x text-primary mb-3"></i>
                    <h5 className="mb-3">Drag and drop your file here</h5>
                    <p className="text-muted mb-4">or click the button below to select a file</p>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="video/*,image/*"
                      className="d-none"
                      id="fileInput"
                    />
                    <label htmlFor="fileInput" className="btn btn-primary btn-lg">
                      <i className="fas fa-folder-open me-2"></i>
                      Choose File
                    </label>
                    <div className="mt-3">
                      <small className="text-muted">
                        Supported formats: JPG, PNG, BMP, WebP, MP4, AVI, MOV, MKV, WebM (Max: 100MB)
                      </small>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              {file && !loading && (
                <div className="text-center mt-4">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="btn btn-success btn-lg px-5"
                    disabled={!file}
                  >
                    <i className="fas fa-search me-2"></i>
                    Analyze for Deepfake
                  </button>
                </div>
              )}

              {/* Progress Bar */}
              {loading && (
                <div className="mt-4">
                  <div className="progress" style={{ height: '25px' }}>
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated"
                      role="progressbar"
                      style={{ width: `${uploadProgress}%` }}
                      aria-valuenow={uploadProgress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {uploadProgress}% - Processing...
                    </div>
                  </div>
                  <div className="text-center mt-2">
                    <small className="text-muted">
                      <i className="fas fa-cog fa-spin me-1"></i>
                      Analyzing your file with AI...
                    </small>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="alert alert-danger mt-4">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              {/* Result Display */}
              {result && (
                <div className="mt-5">
                  <div className="row">
                    <div className="col-md-8">
                      <h3 className="mb-4">
                        <i className="fas fa-chart-bar me-2"></i>
                        Analysis Results
                      </h3>
                      
                      {/* Main Result */}
                      <div className={`alert alert-${result.is_deepfake ? 'danger' : 'success'} border-0 shadow-sm`}>
                        <div className="d-flex align-items-center">
                          <i className={`fas fa-${result.is_deepfake ? 'exclamation-triangle' : 'check-circle'} fa-2x me-3`}></i>
                          <div>
                            <h4 className="mb-1">
                              {result.is_deepfake ? 'Deepfake Detected!' : 'Authentic Content'}
                            </h4>
                            <p className="mb-0">
                              The AI model has identified this content as {result.is_deepfake ? 'manipulated' : 'genuine'}.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Confidence Score */}
                      <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                          <h5 className="card-title">
                            <i className="fas fa-percentage me-2"></i>
                            Confidence Score
                          </h5>
                          <div className="d-flex align-items-center">
                            <div className="flex-grow-1 me-3">
                              <div className="progress" style={{ height: '30px' }}>
                                <div
                                  className={`progress-bar bg-${getConfidenceColor(result.confidence)}`}
                                  role="progressbar"
                                  style={{ width: `${result.confidence * 100}%` }}
                                >
                                  {Math.round(result.confidence * 100)}%
                                </div>
                              </div>
                            </div>
                            <div className="text-end">
                              <div className={`badge bg-${getConfidenceColor(result.confidence)} fs-6`}>
                                {getConfidenceText(result.confidence)} Confidence
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Detailed Information */}
                      <div className="card border-0 shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title">
                            <i className="fas fa-info-circle me-2"></i>
                            Analysis Details
                          </h5>
                          <div className="row">
                            <div className="col-md-6">
                              <p><strong>File Type:</strong> {result.type}</p>
                              <p><strong>Model Label:</strong> {result.label}</p>
                              <p><strong>Analysis Time:</strong> {new Date(result.timestamp).toLocaleString()}</p>
                            </div>
                            <div className="col-md-6">
                              {result.processing_note && (
                                <p><strong>Processing:</strong> {result.processing_note}</p>
                              )}
                              {result.type === 'video' && (
                                <>
                                  <p><strong>Frames Analyzed:</strong> {result.frames_analyzed}</p>
                                  <p><strong>Deepfake Frames:</strong> {result.deepfake_frames}</p>
                                  <p><strong>Real Frames:</strong> {result.frames_analyzed - result.deepfake_frames}</p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Video Frame Results */}
                    {result.type === 'video' && result.frame_results && (
                      <div className="col-md-4">
                        <div className="card border-0 shadow-sm">
                          <div className="card-header bg-light">
                            <h6 className="mb-0">
                              <i className="fas fa-film me-2"></i>
                              Frame Analysis
                            </h6>
                          </div>
                          <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {result.frame_results.map((frame, index) => (
                              <div key={index} className="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                                <span className="small">{frame.frame}</span>
                                <div className="d-flex gap-2">
                                  <span className={`badge bg-${frame.is_deepfake ? 'danger' : 'success'} small`}>
                                    {frame.is_deepfake ? 'Fake' : 'Real'}
                                  </span>
                                  <span className="small text-muted">
                                    {Math.round(frame.confidence * 100)}%
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-4">
            <p className="text-muted small">
              Powered by <a href="https://huggingface.co/dima806/deepfake_vs_real_image_detection" target="_blank" rel="noopener noreferrer">Hugging Face Transformers</a> • 
              Built with React & Node.js
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;