const serverless = require('serverless-http');
const express = require('express');
const dotenv = require('dotenv');
const ChatChain = require('./chatChain');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all origins

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/ask', async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const chatChain = new ChatChain(OPENAI_API_KEY); // Fetch API key from environment variables
    const answer = await chatChain.ask(question);
    res.json({ answer });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to get an answer' });
  }
});

// Test route to verify Lambda function
app.get('/test', (req, res) => {
  res.json({ message: 'Lambda function is working correctly!' });
});

module.exports.handler = serverless(app);
