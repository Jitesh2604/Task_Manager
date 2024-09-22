const mongoose = require("mongoose");
require('dotenv').config();
const url = process.env.mongoDbUrl;

const connectDB = async () => {
    try {
        await mongoose.connect(url);
        console.log("MongoDb Connected Succesfully!");
    } catch (error) {
        console.log("MongoDb Connection Failed!");
    }
};

module.exports = connectDB;