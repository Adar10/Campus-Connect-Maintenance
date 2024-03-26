import express from 'express';
import path from 'path';
import multer from 'multer';
import { signInWithGoogle, signOutWithGoogle, createDocument, readDocuments, updateDocument, deleteDocument, onAuthStateChanged, auth, db } from './index.js';

const app = express();

const PORT = process.env.PORT || 3200;

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(''), '../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Handle file upload
app.post('/upload', upload.array('files'), (req, res) => {
    res.send('Files uploaded successfully');
});

// Define a route handler for the root URL ("/")
app.get('/', (req, res) => {
    res.sendFile(path.join(path.dirname(''), '../public', 'frame1.html'));
});

// Serve different HTML files based on the request URL
app.get('/frame1.html', (req, res) => {
    res.sendFile(path.join(path.dirname(''), '../public', 'frame1.html'));
});

app.get('/frame2.html', (req, res) => {
    res.sendFile(path.join(path.dirname(''), '../public', 'frame2.html'));
});

app.get('/frame3.html', (req, res) => {
    res.sendFile(path.join(path.dirname(''), '../public', 'frame3.html'));
});

app.get('/frame4.html', (req, res) => {
    res.sendFile(path.join(path.dirname(''), '../public', 'frame4.html'));
});

app.get('/frame5.html', (req, res) => {
    res.sendFile(path.join(path.dirname(''), '../public', 'frame5.html'));
});

// Handle file upload
app.post('/upload', upload.array('files'), (req, res) => {
    res.send('Files uploaded successfully');
});

app.listen(PORT, () => {
    console.log(`Server is up and running at port ${PORT}`);
});

document.getElementById("googleSignInButton").addEventListener("click", signInWithGoogle);
document.getElementById("googleSignOutButton").addEventListener("click", signOutWithGoogle);