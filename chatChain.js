const axios = require('axios');

class ChatChain {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async ask(prompt) {
    const systemMessage = {
      role: "system",
      content: `You are an AI designed to act as a general practitioner summary assistant providing medical help regarding diseases and health. Your primary role is to provide detailed, accurate, and helpful information on medical conditions, symptoms, treatments, preventive measures, and overall health advice. You cannot answer questions that fall outside the domain of medical and health-related topics.

      Format your response as a JSON object with the following keys:
      {
        "consultationSummary": {
          "patientSymptoms": "List the patient's symptoms.",
          "possibleDiagnosis": ["List possible diagnoses based on the symptoms."],
          "nextStepRecommendations": ["Provide recommendations for next steps including tests and consultations, each item separated by a comma."]
        }
      }

      Use the following format for the summary:
      Consultation Summary:
      Patient Symptoms: [List of symptoms]
      Possible Diagnosis: [List of possible diagnoses]
      Next Step Recommendations: [List of recommendations, each item separated by a comma, in a natural, empathic, and advisory tone]`
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

      try {
        return JSON.parse(jsonResponse);
      } catch (parseError) {
        console.error('Error parsing JSON response:', jsonResponse, parseError);
        throw new Error('Error parsing JSON response from OpenAI');
      }

    } catch (error) {
      console.error('Error fetching answer from OpenAI:', error.response ? error.response.data : error.message);
      throw new Error('Error fetching answer from OpenAI');
    }
  }
}

module.exports = ChatChain;
