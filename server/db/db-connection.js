const mongoose = require('mongoose');

module.exports = async function connectToMongoDB() {
    const db_uri = process.env.DB_URI;
    try {
        await mongoose.connect(db_uri);
        console.log('Successfully connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error); 
    }
};
