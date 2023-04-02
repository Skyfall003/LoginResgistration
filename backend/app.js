require('dotenv').config();
const express = require('express');
const connectDb = require('./db');
const User = require('./models/userSchema');

const app = express();
app.use(require('./router/auth'));


connectDb()
    .then(() => {
        app.listen(process.env.PORT,() => {
            console.log(`app is listening on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error(err);
    })


