const axios = require('axios');

class ChatChain {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async ask(prompt) {
    const systemMessage = {
      role: "system",
      content: `You are an AI designed to act as a general practitioner summery assistant providing medical help regarding diseases and health. Your primary role is to provide detailed, accurate, and helpful information on medical conditions, symptoms, treatments, preventive measures, and overall health advice. You cannot answer questions that fall outside the domain of medical and health-related topics.

      
      Format your response as a JSON object with the following keys:
      {
        "explanation": "Detailed explanation of the medical condition.",
        "selfCareInstructions": "Instructions on how the user can take care of themselves.",
        "ifItGetsWorse": "Advice on what to do if the condition worsens.",
        "symptomsToWatchOutFor": "Key symptoms that the user should monitor."
      }`
    };

    const userMessage = { role: "user", content: prompt };

    const requestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, userMessage],
      temperature: 0.7
    };

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      const jsonResponse = response.data.choices[0].message.content.trim();
      return JSON.parse(jsonResponse);
    } catch (error) {
      console.error('Error fetching answer from OpenAI:', error.response ? error.response.data : error.message);
      throw new Error('Error fetching answer from OpenAI');
    }
  }
}

module.exports = ChatChain;
