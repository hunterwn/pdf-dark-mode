// Import express framework
const express = require('express');

// Import middleware
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const findRemoveSync = require('find-remove');

//Set CORS options
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

// Import routes
const uploadRouter = require('./routes/upload-route');
const pdfRouter = require('./routes/pdf-route');

// Setup default port
const PORT = (process.env.PORT || 4000);

// Create express app
const app = express();

// Every 10 mins check for files older than 1 hour and delete
const tenMinutes = 10 * 60 * 1000;
setInterval(() => {
  const result = findRemoveSync('./server/data/', {age: {seconds: 3600}, extensions: '.pdf'});
  for(const key in result) {
    if(result.hasOwnProperty(key)) {
      console.log('Deleted ' + key);
    }
  }
}, tenMinutes);


// Implement middleware
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// For development
if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
  app.get('*', (req, res) => {
    res.sendFile('build/index.html', { root: __dirname });
  });
};

// Implement routes
app.use('/upload', uploadRouter);
app.use('/pdf', pdfRouter);

// Start express app
app.listen(PORT, function() {
  console.log(`Server is running on: ${PORT}`);
});

