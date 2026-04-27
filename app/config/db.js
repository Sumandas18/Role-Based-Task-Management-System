require('dotenv').config();
const e = require('express');
const mongoose = require('mongoose');

const MongoDB_URL = process.env.MONGODB_URL;

const connectDB = async () => {
    try {
        const conection = await mongoose.connect(MongoDB_URL)
        if(conection){
            console.log('MongoDB Connected');
        }else{
            console.log('MongoDB Connection Failed');
        }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = connectDB;