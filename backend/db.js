require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.URL;

const connectDb = async () => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('mongodb connected');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDb;