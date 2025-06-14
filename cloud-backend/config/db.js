// // config/db.js
// const { MongoClient } = require('mongodb');
// const logger = require('../utils/logger');

// const uri = process.env.MONGODB_URI;
// const dbName = process.env.MONGODB_DB_NAME || 'cloud-docs';

// // Database collections
// let documentsCollection;
// let classificationsCollection;

// // Connect to the database
// async function connectDB() {
//   try {
//     if (!uri) {
//       throw new Error('MONGODB_URI is not defined in environment variables');
//     }
    
//     const client = new MongoClient(uri);
//     await client.connect();
    
//     const db = client.db(dbName);
    
//     // Initialize collections
//     documentsCollection = db.collection('documents');
//     classificationsCollection = db.collection('classifications');
    
//     // Create indexes for efficient queries
//     await documentsCollection.createIndex({ title: 'text', content: 'text' });
//     await documentsCollection.createIndex({ classification: 1 });
//     await documentsCollection.createIndex({ uploadDate: -1 });
    
//     logger.info('Connected to MongoDB successfully');
//     return { documentsCollection, classificationsCollection };
//   } catch (error) {
//     logger.error(`MongoDB connection error: ${error.message}`);
//     process.exit(1);
//   }
// }

// // Get collections (to be used in controllers)
// const getCollections = async () => {
//   if (!documentsCollection || !classificationsCollection) {
//     await connectDB();
//   }
//   return { documentsCollection, classificationsCollection };
// };

// module.exports = { connectDB, getCollections };

// config/db.js - Updated with SSL fix
const { MongoClient } = require('mongodb');
const logger = require('../utils/logger');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'cloud-docs';

// Database collections
let client;
let documentsCollection;
let classificationsCollection;

// Connect to the database with SSL fix
async function connectDB() {
  try {
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    console.log('🔄 Attempting to connect to MongoDB...');
    
    // SSL-friendly connection options
    const options = {
      // SSL/TLS Configuration
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      
      // Connection timeouts
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      
      // Connection pool
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      
      // Other options
      retryWrites: true,
      w: 'majority',
      
      // Authentication
      authSource: 'admin'
    };
    
    client = new MongoClient(uri, options);
    
    console.log('🔄 Connecting to MongoDB with SSL...');
    await client.connect();
    
    console.log('✅ MongoDB client connected successfully');
    
    // Test the connection with a simple ping
    console.log('🔄 Testing connection with ping...');
    await client.db(dbName).admin().ping();
    console.log('✅ MongoDB ping successful');
    
    const db = client.db(dbName);
    console.log(`✅ Connected to database: ${dbName}`);
    
    // Initialize collections
    documentsCollection = db.collection('documents');
    classificationsCollection = db.collection('classifications');
    console.log('✅ Collections initialized');
    
    // Create indexes for efficient queries (with error handling)
    try {
      console.log('🔄 Setting up database indexes...');
      
      // Check existing indexes first
      const existingIndexes = await documentsCollection.listIndexes().toArray();
      const indexNames = existingIndexes.map(index => index.name);
      console.log('📋 Existing indexes:', indexNames);
      
      // Create text search index if it doesn't exist
      if (!indexNames.some(name => name.includes('text'))) {
        await documentsCollection.createIndex(
          { title: 'text', content: 'text' },
          { 
            name: 'search_text_index',
            background: true,
            default_language: 'english'
          }
        );
        console.log('✅ Text search index created');
      } else {
        console.log('✅ Text search index already exists');
      }
      
      // Create classification index
      if (!indexNames.includes('classification_1')) {
        await documentsCollection.createIndex(
          { classification: 1 },
          { name: 'classification_1', background: true }
        );
        console.log('✅ Classification index created');
      }
      
      // Create upload date index
      if (!indexNames.includes('uploadDate_-1')) {
        await documentsCollection.createIndex(
          { uploadDate: -1 },
          { name: 'uploadDate_-1', background: true }
        );
        console.log('✅ Upload date index created');
      }
      
      console.log('✅ All database indexes are ready');
      
    } catch (indexError) {
      console.log('⚠️  Index setup warning:', indexError.message);
      // Continue even if index creation fails
    }
    
    logger.info('MongoDB connection and setup completed successfully');
    return { documentsCollection, classificationsCollection };
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    // Enhanced error diagnosis
    if (error.message.includes('SSL') || error.message.includes('TLS') || error.code === 'ECONNRESET') {
      console.error('\n🔧 SSL/TLS Error - Trying alternative connection...');
      
      try {
        // Try with relaxed SSL settings
        const relaxedOptions = {
          tls: true,
          tlsAllowInvalidCertificates: true,
          tlsAllowInvalidHostnames: true,
          serverSelectionTimeoutMS: 10000,
          connectTimeoutMS: 10000,
          authSource: 'admin',
          retryWrites: true
        };
        
        console.log('🔄 Trying relaxed SSL connection...');
        client = new MongoClient(uri, relaxedOptions);
        await client.connect();
        
        const db = client.db(dbName);
        documentsCollection = db.collection('documents');
        classificationsCollection = db.collection('classifications');
        
        console.log('✅ Connected with relaxed SSL settings');
        return { documentsCollection, classificationsCollection };
        
      } catch (relaxedError) {
        console.error('❌ Relaxed SSL connection also failed:', relaxedError.message);
        throw new Error(`SSL Connection Failed: ${error.message}`);
      }
    }
    
    if (error.message.includes('authentication') || error.message.includes('auth')) {
      console.error('\n🔧 Authentication Error Solutions:');
      console.error('1. Verify username and password in connection string');
      console.error('2. Check user permissions in MongoDB Atlas Database Access');
      console.error('3. Ensure user has readWrite role on the database');
    }
    
    if (error.message.includes('timeout') || error.message.includes('network')) {
      console.error('\n🔧 Network Error Solutions:');
      console.error('1. Check internet connection');
      console.error('2. Add 0.0.0.0/0 to IP whitelist in MongoDB Atlas');
      console.error('3. Try increasing timeout values');
      console.error('4. Check if firewall is blocking port 27017');
    }
    
    logger.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
}

// Get collections with connection health check
const getCollections = async () => {
  try {
    // Initialize if not already done
    if (!documentsCollection || !classificationsCollection) {
      console.log('🔄 Initializing database connection...');
      await connectDB();
    }
    
    // Health check - try a simple operation
    try {
      await client.db(dbName).admin().ping();
    } catch (healthError) {
      console.log('🔄 Connection health check failed, reconnecting...');
      await connectDB();
    }
    
    return { documentsCollection, classificationsCollection };
    
  } catch (error) {
    logger.error(`Get collections error: ${error.message}`);
    throw error;
  }
};

// Connection health check function
const checkConnectionHealth = async () => {
  try {
    if (!client) return false;
    await client.db(dbName).admin().ping();
    return true;
  } catch (error) {
    console.log('❌ Connection health check failed:', error.message);
    return false;
  }
};

// Graceful shutdown
const gracefulShutdown = async () => {
  try {
    if (client) {
      console.log('🔄 Closing MongoDB connection...');
      await client.close();
      console.log('✅ MongoDB connection closed gracefully');
    }
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error.message);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  await gracefulShutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await gracefulShutdown();
  process.exit(0);
});

module.exports = { 
  connectDB, 
  getCollections, 
  checkConnectionHealth,
  gracefulShutdown 
};

// config/db.js - Replace your current db.js with this
// const { MongoClient } = require('mongodb');
// const logger = require('../utils/logger');

// const uri = process.env.MONGODB_URI;
// const dbName = process.env.MONGODB_DB_NAME || 'cloud-docs';

// // Database collections
// let documentsCollection;
// let classificationsCollection;

// // Connect to the database with SSL options
// async function connectDB() {
//   try {
//     if (!uri) {
//       throw new Error('MONGODB_URI is not defined in environment variables');
//     }
    
//     console.log('🔄 Attempting to connect to MongoDB...');
    
//     const client = new MongoClient(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       ssl: true,
//       tlsAllowInvalidCertificates: true,
//       serverSelectionTimeoutMS: 10000, // 10 second timeout
//       connectTimeoutMS: 10000,
//     });
    
//     await client.connect();
//     console.log('✅ MongoDB client connected');
    
//     const db = client.db(dbName);
//     console.log(`✅ Connected to database: ${dbName}`);
    
//     // Initialize collections
//     documentsCollection = db.collection('documents');
//     classificationsCollection = db.collection('classifications');
    
//     // Create indexes for efficient queries
//     try {
//       await documentsCollection.createIndex({ title: 'text', content: 'text' });
//       await documentsCollection.createIndex({ classification: 1 });
//       await documentsCollection.createIndex({ uploadDate: -1 });
//       console.log('✅ Database indexes created');
//     } catch (indexError) {
//       console.log('⚠️  Index creation warning:', indexError.message);
//     }
    
//     logger.info('Connected to MongoDB successfully');
//     return { documentsCollection, classificationsCollection };
//   } catch (error) {
//     console.error('❌ MongoDB connection error:', error.message);
    
//     // More specific error handling
//     if (error.message.includes('SSL')) {
//       console.error('💡 SSL Connection Issue - trying alternative connection...');
//     }
//     if (error.message.includes('authentication')) {
//       console.error('💡 Authentication Issue - check your username/password');
//     }
//     if (error.message.includes('network')) {
//       console.error('💡 Network Issue - check your internet connection');
//     }
    
//     logger.error(`MongoDB connection error: ${error.message}`);
//     throw error; // Don't exit, let the app handle it
//   }
// }

// // Get collections (to be used in controllers)
// const getCollections = async () => {
//   if (!documentsCollection || !classificationsCollection) {
//     await connectDB();
//   }
//   return { documentsCollection, classificationsCollection };
// };

// module.exports = { connectDB, getCollections };


// //mongodb+srv://alsahharsarah:ED3bL2GbNDFgHMI3@cluster0.p8efnkv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0