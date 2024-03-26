import express from 'express';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url'; // Import fileURLToPath function
import { signInWithGoogle, signOutWithGoogle, createDocument, readDocuments, updateDocument, deleteDocument, onAuthStateChanged, auth, db } from './index.js';

const __filename = fileURLToPath(import.meta.url); // Convert import.meta.url to filename
const __dirname = path.dirname(__filename); // Derive dirname from filename

const app = express();

const PORT = process.env.PORT || 3200;

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads')); // Adjusted the destination path
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
    res.sendFile(path.join(__dirname, '..', 'public', 'frame1.html')); // Adjusted the file path
});

// Serve different HTML files based on the request URL
app.get('/frame1.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'frame1.html')); // Adjusted the file path
});

app.get('/frame2.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'frame2.html')); // Adjusted the file path
});

app.get('/frame3.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'frame3.html')); // Adjusted the file path
});

app.get('/frame4.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'frame4.html')); // Adjusted the file path
});

app.get('/frame5.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'frame5.html')); // Adjusted the file path
});

// Handle file upload
app.post('/upload', upload.array('files'), (req, res) => {
    res.send('Files uploaded successfully');
});

app.listen(PORT, () => {
    console.log(`Server is up and running at port ${PORT}`);
});


document.getElementById("googleSignInButton").addEventListener("click", signInWithGoogle);

// Add event listener for Google Sign Out button
document.getElementById("googleSignOutButton").addEventListener("click", signOutWithGoogle);