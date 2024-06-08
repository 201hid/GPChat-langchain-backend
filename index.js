const serverless = require('serverless-http');
const express = require('express');
const dotenv = require('dotenv');
const ChatChain = require('./chatChain');

dotenv.config();

const app = express();
app.use(express.json());

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

module.exports.handler = serverless(app);
