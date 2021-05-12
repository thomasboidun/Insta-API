require('dotenv').config();

const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const express = require('express');
const cors = require('cors');


const bodyParser = require('body-parser');

const app = express();

// Import router here
const roleRouter = require('./routes/role.router');
const userRouter = require('./routes/user.router');
const pictureRouter = require('./routes/picture.router');
const commentRouter = require('./routes/comment.router');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('tiny', { stream: accessLogStream }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Protect from CORS error
app.use(cors({ credentials: true, origin: 'http://localhost:4200' }));

// Add routes here
app.use('/roles', roleRouter);
app.use('/users', userRouter);
app.use('/pictures', pictureRouter);
app.use('/comments', commentRouter);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    const date = new Date();
    console.log('⚡ Server running:', date.toLocaleDateString(), date.toLocaleTimeString(), '⚡');
  });
}

module.exports = app;
