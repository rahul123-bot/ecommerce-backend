const openAI = require("openai");
const config = require("../config/config.js");


const client = new openAI({
    apiKey:config.openAi_api_key,
    
});
  const generateResponse = async(message,tools)=>{
     const response = await client.chat.completions.create({

      model: "gpt-4o-mini",

      messages: [

          {
            role: "system",

            content:
              `You are an ecommerce AI assistant.
               Use available tools when necessary.`,
          },

          {
            role: "user",

            content: message,
          },

        ],

      tools,

      tool_choice: "auto",

    });
    return response.choices[0].message;
  }
module.exports = generateResponse;
