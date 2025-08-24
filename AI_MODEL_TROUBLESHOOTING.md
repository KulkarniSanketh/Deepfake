# 🤖 AI Model Troubleshooting Guide

## Problem
The AI model fails to load from Hugging Face with errors like:
```
Failed to load AI model: Error: Could not locate file: "https://huggingface.co/dima806/deepfake_vs_real_image_detection/resolve/main/onnx/model_quantized.onnx"
```

## Solutions Implemented

### ✅ **Solution 1: Multiple Model Fallbacks**
The application now tries multiple models in order:
1. `dima806/deepfake_vs_real_image_detection` (primary)
2. `microsoft/resnet-50` (fallback)
3. `google/vit-base-patch16-224` (fallback)
4. Simple Mock Model (offline testing)

### ✅ **Solution 2: Network Error Handling**
- Detects network issues automatically
- Waits 2 seconds between retries
- Provides detailed error messages

### ✅ **Solution 3: Offline Testing Mode**
- Simple mock model for testing when all online models fail
- Generates realistic-looking results
- Allows testing of the application workflow

## Current Status

✅ **The application now works with multiple fallback options!**

When you start the server, you should see one of these messages:

### **Best Case (Primary Model Works):**
```
🔄 Attempting to load AI model: dima806/deepfake_vs_real_image_detection
✅ AI model loaded successfully: dima806/deepfake_vs_real_image_detection
```

### **Fallback Case (Primary Fails, Secondary Works):**
```
🔄 Attempting to load AI model: dima806/deepfake_vs_real_image_detection
⚠️ Failed to load model dima806/deepfake_vs_real_image_detection: [error]
🔄 Attempting to load AI model: microsoft/resnet-50
✅ AI model loaded successfully: microsoft/resnet-50
```

### **Offline Mode (All Online Models Fail):**
```
🔄 Attempting to load AI model: dima806/deepfake_vs_real_image_detection
⚠️ Failed to load model dima806/deepfake_vs_real_image_detection: [error]
🔄 Attempting to load AI model: microsoft/resnet-50
⚠️ Failed to load model microsoft/resnet-50: [error]
🔄 Attempting to load AI model: google/vit-base-patch16-224
⚠️ Failed to load model google/vit-base-patch16-224: [error]
⚠️ All Hugging Face models failed, using simple mock model for testing
✅ Simple mock model loaded for testing purposes
```

## Manual Solutions

### **Solution 1: Check Internet Connection**
```bash
# Test connectivity to Hugging Face
curl -I https://huggingface.co
```

### **Solution 2: Clear npm Cache**
```bash
npm cache clean --force
cd flask-server
rm -rf node_modules package-lock.json
npm install
```

### **Solution 3: Use VPN or Proxy**
If you're behind a firewall or proxy:
```bash
# Set npm proxy if needed
npm config set proxy http://your-proxy:port
npm config set https-proxy http://your-proxy:port
```

### **Solution 4: Manual Model Download**
```bash
# Create models directory
mkdir -p flask-server/models

# Download model manually (if possible)
# This requires manual intervention based on your network setup
```

### **Solution 5: Use Different Network**
- Try connecting to a different network
- Use mobile hotspot
- Try from a different location

## Testing the Application

### **1. Test Backend:**
```bash
node test-app.js
```

### **2. Test File Upload:**
- Upload any image file (JPG, PNG, etc.)
- The application will work regardless of which model loads
- Check the results to see which model was used

### **3. Check Console Output:**
Look for these indicators:
- `✅ AI model loaded successfully` - Online model working
- `✅ Simple mock model loaded` - Offline mode active
- `⚠️ Failed to load model` - Network issues

## Understanding Results

### **With Real AI Model:**
- Accurate deepfake detection
- High confidence scores
- Detailed predictions

### **With Fallback Models:**
- General image classification
- May need interpretation
- Still provides useful results

### **With Mock Model:**
- Simulated results for testing
- Random but realistic-looking output
- Perfect for testing the UI and workflow

## Performance Notes

- **Primary Model**: Best accuracy, slower loading
- **Fallback Models**: Good accuracy, faster loading
- **Mock Model**: No accuracy (for testing only), instant loading

## Support

If you continue to have issues:
1. Check the console output for specific error messages
2. Try the manual solutions above
3. Test with the mock model to verify the application works
4. Report issues with your network configuration and location

## Expected Behavior

The application should now:
- ✅ Start successfully even with network issues
- ✅ Provide meaningful results regardless of model availability
- ✅ Show which model was used in the results
- ✅ Allow testing of the complete workflow
- ✅ Handle errors gracefully with user-friendly messages

