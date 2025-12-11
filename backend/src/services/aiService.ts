import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_CONFIG, validateAIConfig } from '../config/ai';
import { Conversation } from '../models/Conversation';
import logger from '../utils/logger';

const SUPPORTED_LANGUAGES = {
  HINDI: 'hi',
  SANTHALI: 'sat',
  NAGPURI: 'nag',
};

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const aiService = {
  async sendMessage(
    message: string,
    conversationId?: string,
    language: string = 'hi'
  ): Promise<{ response: string; extractedData?: any }> {
    validateAIConfig();

    try {
      const genAI = new GoogleGenerativeAI(AI_CONFIG.apiKey);
      const model = genAI.getGenerativeModel({ model: AI_CONFIG.model });

      // Get conversation history
      let conversation: any = null;
      if (conversationId) {
        conversation = await Conversation.findById(conversationId);
      }

      // Build context
      const systemPrompt = this.getSystemPrompt(language);
      const history = conversation?.messages || [];
      
      // Format messages for Gemini
      const chat = model.startChat({
        history: history.map((msg: ChatMessage) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
      });

      // Send message
      const result = await chat.sendMessage(message);
      const response = result.response.text();

      // Extract data if needed
      const extractedData = this.extractData(response, message);

      // Save to conversation
      if (conversation) {
        conversation.messages.push(
          { role: 'user', content: message, timestamp: new Date() },
          { role: 'assistant', content: response, timestamp: new Date() }
        );
        if (extractedData) {
          conversation.extracted_data = { ...conversation.extracted_data, ...extractedData };
        }
        await conversation.save();
      }

      return { response, extractedData };
    } catch (error: any) {
      logger.error('AI service error', { error: error.message });
      throw new Error(`AI service failed: ${error.message}`);
    }
  },

  getSystemPrompt(language: string): string {
    const prompts: Record<string, string> = {
      hi: `आप एक साइबर अपराध रिपोर्टिंग सहायक हैं। आपको नागरिकों की मदद करनी है:
1. अपराध का प्रकार पहचानें
2. राशि निकालें (यदि वित्तीय)
3. तारीख/समय पार्स करें
4. स्थान निकालें
5. विवरण सारांशित करें

हिंदी में जवाब दें और मित्रतापूर्ण रहें।`,
      sat: 'You are a cybercrime reporting assistant. Help citizens in Santhali language.',
      nag: 'You are a cybercrime reporting assistant. Help citizens in Nagpuri language.',
    };

    return prompts[language] || prompts.hi;
  },

  extractData(response: string, message: string): any {
    // Simple extraction - can be enhanced with better NLP
    const data: any = {};

    // Extract amount
    const amountMatch = message.match(/₹?(\d+[,\d]*)/);
    if (amountMatch) {
      data.amount = parseInt(amountMatch[1].replace(/,/g, ''));
    }

    // Extract crime type keywords
    const crimeTypes = [
      'Financial Theft',
      'Fraud Call',
      'OTP Scam',
      'Online Harassment',
      'Phishing',
      'Identity Theft',
    ];
    for (const type of crimeTypes) {
      if (message.toLowerCase().includes(type.toLowerCase())) {
        data.crime_type = type;
        break;
      }
    }

    return Object.keys(data).length > 0 ? data : undefined;
  },
};

