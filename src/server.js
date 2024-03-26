const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');

const PORT = process.env.PORT || 3200;

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

/*
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public', 'frame1.html')));
*/

// Handle file upload
app.post('/upload', upload.array('files'), (req, res) => {
    res.send('Files uploaded successfully');
});

// Define a route handler for the root URL ("/")
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'frame1.html'));
});

// Serve different HTML files based on the request URL
app.get('/frame1.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'frame1.html'));
});

app.get('/frame2.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'frame2.html'));
});

app.get('/frame3.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'frame3.html'));
});

app.get('/frame4.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'frame4.html'));
});

app.get('/frame5.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'frame5.html'));
});

// Handle file upload
app.post('/upload', upload.array('files'), (req, res) => {
    res.send('Files uploaded successfully');
});

app.listen(PORT, () => {
    console.log(`Server is up and running at port ${PORT}`);
});