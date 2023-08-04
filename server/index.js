require('dotenv').config({path: 'config/server.env'});
const mongoose = require('mongoose');
const app = require('./app');

const db = process.env.DATABASE.replace('<password>', process.env.PASSWORD);
mongoose.set('strictQuery', false);
mongoose.connect(db, (err) => {
    if (err) throw err;
    console.log('Database connection successful');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server is running at port', port);
});
