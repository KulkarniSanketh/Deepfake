const axios = require('axios');

async function testBackend() {
  try {
    console.log('🧪 Testing Backend Server...');
    
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Health check passed:', healthResponse.data);
    
    console.log('🎉 Backend server is running correctly!');
    console.log('📝 You can now start the frontend with: cd client && npm run dev');
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    console.log('💡 Make sure the backend server is running on port 5000');
    console.log('💡 Start it with: cd flask-server && npm start');
  }
}

testBackend();

