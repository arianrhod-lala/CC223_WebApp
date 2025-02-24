const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 8000;

app.use(cors());    

// Ensure pictures directory exists
const uploadDir = 'pictures';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Manages disk storage and image file format
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'pictures/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Fetching images from /pictures folder
app.get('/getImages', (req, res) => {
    const picturesDir = path.join(__dirname, 'pictures');
    fs.readdir(picturesDir, (err, files) => {
        if (err) {
            return res.status(500).send("Unable to read the pictures directory");
        }
        // Filter and return only image files
        const imageFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png'));
        res.json(imageFiles);
    });
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/pictures', express.static(path.join(__dirname, '/pictures')));

// Uploading photos 
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const { description, vibe, rating } = req.body;
    const imageUrl = `/pictures/${req.file.filename}`;

    res.json({
        imageSrc: imageUrl,
        description,
        vibe,
        rating
    });
});

// Render the index.html starting file for the user
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Test 
app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});