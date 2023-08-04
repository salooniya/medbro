const express = require('express');
const cookiePaser = require('cookie-parser');
const morgan = require('morgan');
const multer = require('multer');
const viewRouter = require('./routers/viewRouter');
const userRouter = require('./routers/userRouter');
const doctorRouter = require('./routers/doctorRouter');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `${Date.now()}.${ext}`)
    }
});

const upload = multer({ storage: multerStorage });
const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookiePaser());
app.use(upload.any());

app.use('/', viewRouter);
app.use('/api/users', userRouter);
app.use('/api/doctors', doctorRouter);

module.exports = app;
