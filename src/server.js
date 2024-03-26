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

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Handle file upload
app.post('/upload', upload.array('files'), (req, res) => {
    res.send('Files uploaded successfully');
});

app.listen(PORT, () => {
    console.log(`Server is up and running at port ${PORT}`);
});