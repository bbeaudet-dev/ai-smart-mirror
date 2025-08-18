const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Smart mirror personality and context
const SMART_MIRROR_CONTEXT = {
  'smart-mirror': `You are a helpful, friendly smart mirror assistant. You provide brief, encouraging responses that are perfect for someone getting ready in the morning or evening. Keep responses under 100 words and be supportive.`,
  'motivation': `You are a motivational coach speaking through a smart mirror. Provide brief, uplifting messages that help people start their day positively or wind down in the evening. Keep it personal and encouraging.`,
  'outfit-analysis': `You are a fashion-savvy smart mirror assistant. Analyze outfits with style and weather appropriateness in mind. Be encouraging and constructive, offering helpful suggestions. Keep responses under 150 words.`,
  'outfit-recommendation': `You are a friendly fashion advisor in a smart mirror. Provide practical, weather-appropriate outfit recommendations that are encouraging and helpful. Keep responses concise (under 100 words) and consider temperature, conditions, and comfort.`
};

class OpenAIService {
  /**
   * Send a chat message to OpenAI
   * @param {string} message - The user's message
   * @param {string} context - The context/personality to use
   * @returns {Promise<string>} - The AI response
   */
  static async chat(message, context = 'smart-mirror') {
    try {
      const systemPrompt = SMART_MIRROR_CONTEXT[context] || SMART_MIRROR_CONTEXT['smart-mirror'];
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI Chat Error:', error);
      throw new Error(`Failed to get AI response: ${error.message}`);
    }
  }

  /**
   * Analyze an image using OpenAI Vision API
   * @param {Buffer} imageBuffer - The image buffer
   * @param {string} imageType - The MIME type of the image
   * @param {string} prompt - The analysis prompt
   * @param {string} context - The context for the analysis
   * @returns {Promise<string>} - The analysis result
   */
  static async analyzeImage(imageBuffer, imageType, prompt, context = 'outfit-analysis') {
    try {
      const systemPrompt = SMART_MIRROR_CONTEXT[context] || SMART_MIRROR_CONTEXT['outfit-analysis'];
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${imageType};base64,${imageBuffer.toString('base64')}`
                }
              }
            ]
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI Vision Error:', error);
      throw new Error(`Failed to analyze image: ${error.message}`);
    }
  }

  /**
   * Generate a motivational message
   * @param {string} timeOfDay - 'morning' or 'evening'
   * @param {string} mood - User's current mood
   * @returns {Promise<string>} - The motivational message
   */
  static async generateMotivation(timeOfDay = 'morning', mood = 'neutral') {
    const prompt = `Create a brief, uplifting ${timeOfDay} motivation message. Consider the user's mood (${mood}) and make it feel personal and encouraging. This is for someone using a smart mirror.`;
    
    return this.chat(prompt, 'motivation');
  }

  /**
   * Check if OpenAI API key is configured
   * @returns {boolean} - True if API key is available
   */
  static isConfigured() {
    return !!process.env.OPENAI_API_KEY;
  }
}

module.exports = OpenAIService;
