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
//     const client = new MongoClient(uri);
//     await client.connect();
    
//     const db = client.db(dbName);
    
//     // Initialize collections
//     documentsCollection = db.collection('documents');
//     classificationsCollection = db.collection('classifications');
    
//     // Create indexes for efficient queries
//     await documentsCollection.createIndex({ title: 'text', content: 'text' });
    
//     logger.info('Connected to MongoDB');
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

// // const logger = {
// //   info: (message) => console.log(`INFO: ${message}`),
// //   error: (message) => console.log(`ERROR: ${message}`),
// //   warn: (message) => console.log(`WARN: ${message}`)
// // };

// // module.exports = logger;

const logger = {
  info: (message) => console.log(`[${new Date().toISOString()}] INFO: ${message}`),
  error: (message) => console.error(`[${new Date().toISOString()}] ERROR: ${message}`),
  warn: (message) => console.warn(`[${new Date().toISOString()}] WARN: ${message}`)
};

module.exports = logger;