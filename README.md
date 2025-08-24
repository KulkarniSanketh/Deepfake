# 🔍 Deepfake Detection Application

A modern, AI-powered web application for detecting deepfake images and videos using the Hugging Face Transformers library and the `dima806/deepfake_vs_real_image_detection` model.

## ✨ Features

### 🎯 Core Functionality
- **Image Analysis**: Detect deepfakes in images (JPG, PNG, BMP, WebP)
- **Video Analysis**: Analyze videos by sampling frames (MP4, AVI, MOV, MKV, WebM)
- **Real-time Processing**: Fast AI-powered analysis with confidence scores
- **Drag & Drop Interface**: Intuitive file upload with visual feedback

### 🎨 Enhanced UI/UX
- **Modern Design**: Beautiful gradient backgrounds and smooth animations
- **File Preview**: Preview images and videos before analysis
- **Progress Tracking**: Real-time upload and processing progress
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **History Tracking**: View and manage your analysis history
- **Detailed Results**: Comprehensive analysis reports with confidence scores

### 🔧 Technical Features
- **AI Model Integration**: Uses state-of-the-art deepfake detection model
- **Error Handling**: Robust error handling with user-friendly messages
- **File Validation**: Automatic file type and size validation
- **Local Storage**: Persistent analysis history using browser storage
- **Performance Optimized**: Efficient file processing and memory management

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- FFmpeg (for video processing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cidecode
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

### Running the Application

#### **Option 1: Using the root package.json (Recommended)**
```bash
# Start both servers simultaneously
npm run dev
```

#### **Option 2: Manual startup**
```bash
# Terminal 1 - Start backend
npm run start-backend

# Terminal 2 - Start frontend
npm run start-frontend
```

#### **Option 3: Using the batch script (Windows)**
```bash
start.bat
```

#### **Option 4: Using the shell script (Linux/Mac)**
```bash
./start.sh
```

### 🌐 Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📁 Project Structure

```
cidecode/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main application component
│   │   ├── App.css        # Custom styles
│   │   └── main.jsx       # React entry point
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
├── flask-server/          # Node.js backend
│   ├── src/
│   │   └── analyze.js     # AI analysis logic
│   ├── server.js          # Express server
│   ├── package.json       # Backend dependencies
│   └── uploads/           # Temporary file storage
├── package.json           # Root package.json with scripts
├── start.bat             # Windows startup script
├── start.sh              # Unix/Linux startup script
├── test-app.js           # Backend test script
└── README.md             # This file
```

## 🛠️ Technology Stack

### Frontend
- **React 19**: Modern React with hooks
- **Bootstrap 5**: Responsive UI framework
- **Axios**: HTTP client for API calls
- **Vite**: Fast build tool and dev server
- **Font Awesome**: Icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Multer**: File upload handling
- **@xenova/transformers**: Hugging Face Transformers for JavaScript
- **Sharp**: Image processing
- **FFmpeg**: Video processing
- **CORS**: Cross-origin resource sharing

### AI Model
- **Model**: `dima806/deepfake_vs_real_image_detection`
- **Type**: Image classification
- **Framework**: Hugging Face Transformers
- **Capabilities**: Deepfake vs real image detection

## 🎮 Usage Guide

### Uploading Files
1. **Drag and Drop**: Simply drag your image or video file onto the upload area
2. **Click to Select**: Click the "Choose File" button to browse and select a file
3. **Supported Formats**:
   - Images: JPG, JPEG, PNG, BMP, WebP
   - Videos: MP4, AVI, MOV, MKV, WebM
   - Maximum file size: 100MB

### Analysis Process
1. **File Validation**: The system validates file type and size
2. **Upload Progress**: Real-time progress bar shows upload status
3. **AI Processing**: The model analyzes your file
4. **Results Display**: Comprehensive results with confidence scores

### Understanding Results
- **Deepfake Detected**: Red alert with warning icon
- **Authentic Content**: Green alert with checkmark
- **Confidence Score**: Percentage indicating model certainty
- **Detailed Analysis**: File information and processing details

### History Management
- **View History**: Click "Analysis History" to see past analyses
- **Persistent Storage**: History is saved in your browser
- **Clear History**: Use the trash icon to clear analysis history
- **Quick Overview**: See file names, results, and confidence scores

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the `flask-server` directory:

```env
PORT=5000
NODE_ENV=development
```

### Model Configuration
The AI model is automatically downloaded on first use. You can modify the model in `flask-server/src/analyze.js`:

```javascript
const imageModel = await pipeline("image-classification", "dima806/deepfake_vs_real_image_detection")
```

### File Size Limits
Modify file size limits in `flask-server/server.js`:

```javascript
limits: {
  fileSize: 100 * 1024 * 1024, // 100MB limit
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Model Download Fails**
   - Check internet connection
   - Ensure sufficient disk space (at least 500MB free)
   - Try restarting the server
   - Check firewall settings

2. **Video Processing Errors**
   - Install FFmpeg: `brew install ffmpeg` (macOS) or `apt install ffmpeg` (Ubuntu)
   - Ensure video format is supported
   - Try with a smaller video file

3. **Port Already in Use**
   - Change port in `.env` file
   - Kill existing processes: `lsof -ti:5000 | xargs kill` (Unix) or `netstat -ano | findstr :5000` (Windows)

4. **CORS Errors**
   - Ensure backend is running on correct port
   - Check CORS configuration in `server.js`
   - Clear browser cache

5. **File Upload Fails**
   - Check file size (max 100MB)
   - Verify file format is supported
   - Ensure stable internet connection

6. **Frontend Won't Load**
   - Check if backend is running: `node test-app.js`
   - Verify port 5173 is available
   - Clear browser cache and cookies

### Performance Tips
- Use smaller video files for faster processing
- Close other applications to free up memory
- Ensure stable internet connection for model downloads
- Use SSD storage for better performance

### Testing the Application
```bash
# Test backend only
node test-app.js

# Test both servers
npm run dev
```

## 🔒 Security Features

- **File Validation**: Strict file type and size validation
- **Input Sanitization**: All inputs are validated and sanitized
- **Error Handling**: Comprehensive error handling without exposing sensitive information
- **CORS Protection**: Configured CORS for security
- **File Cleanup**: Automatic cleanup of uploaded files

## 🚀 Recent Bug Fixes

### Backend Fixes
- ✅ **Model Initialization**: Fixed lazy loading of AI model
- ✅ **Error Handling**: Improved error messages and handling
- ✅ **File Cleanup**: Better cleanup of temporary files
- ✅ **Video Processing**: Enhanced video frame extraction with error handling
- ✅ **Directory Creation**: Automatic creation of uploads directory

### Frontend Fixes
- ✅ **File Validation**: Enhanced file type and size validation
- ✅ **Error Handling**: Better error messages and network error handling
- ✅ **File Preview**: Improved file preview with error handling
- ✅ **History Management**: Added clear history functionality
- ✅ **Progress Tracking**: Fixed progress bar calculation

### General Fixes
- ✅ **Package Scripts**: Improved npm scripts with better error handling
- ✅ **CORS Configuration**: Enhanced CORS settings
- ✅ **Startup Scripts**: Better startup scripts for different platforms
- ✅ **Documentation**: Updated README with troubleshooting guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) for the AI model
- [dima806](https://huggingface.co/dima806) for the deepfake detection model
- [React](https://reactjs.org/) and [Node.js](https://nodejs.org/) communities

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the documentation
- Test with the provided test script

---

**Note**: This application is for educational and research purposes. Always verify results with multiple sources and use responsibly.
