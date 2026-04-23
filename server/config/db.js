const mongoose = require('mongoose');

const connectDB = async () => {
    if (process.env.MOCK_DB === 'true') {
        console.log('🚀 Running in MOCK DATABASE mode (Demo Only)');
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lostandfound');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.log('Fallback: To use the website without a database, set MOCK_DB=true in your .env file');
        process.exit(1);
    }
};

module.exports = connectDB;
