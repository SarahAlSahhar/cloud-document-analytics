const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

console.log('🚀 Starting server...');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploaded documents
app.use('/api/files', express.static(path.join(__dirname, 'uploads')));

// Import and use API routes
const apiRoutes = require('./routes/index');
app.use('/api', apiRoutes);

// Initialize classification tree on startup
const { initializeClassificationTree } = require('./services/classificationService');
const { connectDB } = require('./config/db');

// Initialize database and classification tree
async function initializeServer() {
  try {
    await connectDB();
    await initializeClassificationTree();
    console.log('✅ Server initialized successfully');
  } catch (error) {
    console.error('❌ Server initialization failed:', error.message);
  }
}

// Basic routes
app.get('/', (req, res) => {
  res.json({
    message: 'Cloud Document Analytics API - Technology Focus',
    status: 'Server is running!',
    endpoints: {
      documents: '/api/documents',
      classifications: '/api/classifications',
      statistics: '/api/statistics'
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.get('/test-db', async (req, res) => {
  try {
    const { connectDB } = require('./config/db');
    await connectDB();
    res.json({ 
      success: true,
      message: 'Database connection successful!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

const port = process.env.PORT || 5000;

app.listen(port, async () => {
    console.log('🚀 ====================================');
    console.log(`🚀 Server running on port ${port}`);
    console.log(`🏠 Home: http://localhost:${port}/`);
    console.log(`🏥 Health: http://localhost:${port}/health`);
    console.log(`🔧 Test DB: http://localhost:${port}/test-db`);
    console.log(`📄 Documents API: http://localhost:${port}/api/documents`);
    console.log(`🏷️  Classifications API: http://localhost:${port}/api/classifications`);
    console.log(`📊 Statistics API: http://localhost:${port}/api/statistics`);
    console.log('🚀 ====================================');
    
    // Initialize server components
    await initializeServer();
});

module.exports = app;