const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const cors = require('cors')
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3001;

async function generateCompletion(prompt) {
  const configuration = new Configuration({
    apiKey: process.env.API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 100,
      n: 1,
    });

    const { choices } = response.data;
    if (choices && choices.length > 0) {
      const completion = choices[0].text.trim();
      return completion;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

app.post("/convert", async (req, res) => {
  try {
    const { code, language } = req.body;
    const prompt = `Convert the following code: ${code} to ${language} code. If the code is incorrect or not complete, please make guesses and complete it.`;

    const response = await generateCompletion(prompt);

    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/debug", async (req, res) => {
  try {
    const { prompt } = req.body;
    const debugPrompt = `Debug the following code: ${prompt}. Please check if there are any errors and also correct them. 
    Additionally, if the code is correct, provide steps on what the code is doing and how we can improve it.`;

    const response = await generateCompletion(debugPrompt);

    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/quality", async (req, res) => {
  try {
    const { prompt } = req.body;
    const qualityPrompt = `Check the quality of the following code: ${prompt}. Please provide detailed information and also provide some tips to improve. Provide in points.`;

    const response = await generateCompletion(qualityPrompt);

    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
