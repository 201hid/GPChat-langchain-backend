const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ChatChain = require('./chatChain');

dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

app.use(express.json());

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/ask', async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const chatChain = new ChatChain(process.env.OPENAI_API_KEY);
    const answer = await chatChain.ask(question);
    res.json({ answer });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to get an answer' });
  }
});

app.post('/ask-voice', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Audio file is required' });
  }

  const audioFilePath = path.join(__dirname, req.file.path);

  try {
    const chatChain = new ChatChain(process.env.OPENAI_API_KEY);
    const transcription = await chatChain.transcribeAudio(audioFilePath);
    if (!transcription) {
      throw new Error('Transcription failed');
    }
    const answer = await chatChain.ask(transcription);
    res.json({ answer });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to get an answer' });
  } finally {
    // Clean up the uploaded file
    fs.unlink(audioFilePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
