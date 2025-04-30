const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const feedbacks = {};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  console.log('File uploaded successfully:', req.file);
  res.status(200).send('File uploaded successfully');
});

// Route to fetch the list of uploaded files
app.get('/files', (req, res) => {
  const directoryPath = path.join(__dirname, 'uploads');
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan files');
    }
    res.json(files);
  });
});

// Route to download files
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.download(filePath, (err) => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
});

// Route to submit feedback for a file
app.post('/feedback', (req, res) => {
  const { filename, feedback } = req.body;

  // If no feedback array exists for the file, create one
  if (!feedbacks[filename]) {
    feedbacks[filename] = [];
  }

  // Store the feedback
  feedbacks[filename].push(feedback);
  console.log(`Feedback for ${filename}: ${feedback}`);
  res.status(200).send('Feedback submitted');
});

// Route to get feedback for a specific file
app.get('/feedback/:filename', (req, res) => {
  const { filename } = req.params;
  res.json(feedbacks[filename] || []); // Return feedback for the file or an empty array if none
});

// Start the backend server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
