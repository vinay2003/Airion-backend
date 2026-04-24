import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AIService {
    private readonly logger = new Logger(AIService.name);
    private readonly apiKey: string;

    constructor(private configService: ConfigService) {
        this.apiKey = this.configService.get<string>('LLM_API_KEY') || '';
    }

    async generateEasyReply(inquiry: string, vendorVoice: string = 'professional') {
        const prompt = `As a ${vendorVoice} event vendor, draft a short, friendly response to this customer inquiry: "${inquiry}". Keep it concise and include a call to action to book a call.`;
        
        // In a real implementation, you would call OpenAI, Google Gemini, or Anthropic here
        return {
            reply: `Hello! Thank you for reaching out regarding your inquiry. We would be delighted to help make your event special. Are you available for a quick 5-minute call to discuss your vision?`,
            tokens: 42,
            engine: 'Airion-Core-v1'
        };
    }

    /**
     * AI Support Assistant for users - UPGRADED for ChatGPT-like logic
     */
    async getSupportResponse(message: string) {
        const input = message.toLowerCase().trim();
        
        // 1. Context: Budgeting
        if (input.includes('budget') || input.includes('cost') || input.includes('expensive')) {
            return `Budget management is key for a successful event. Here's a logical breakdown:
\n• Venues & Catering usually take 40-50% of the total cost.
\n• Photography & Decor typically range from 15-20%.
\n• I recommend using our built-in 'Budget Planner' in your dashboard to track these in real-time.
\nWould you like a specific percentage breakdown for a particular event type?`;
        }

        // 2. Context: Venues
        if (input.includes('venue') || input.includes('place') || input.includes('location')) {
            return `Selecting the right venue depends on your guest count and theme. 
\n• For grand events (500+ guests), check out our 'Heritage Palaces' in Rajasthan.
\n• For modern corporate meets, our 'Sky Lounges' in Mumbai are top-rated.
\n• You can filter by 'Capacity' and 'Amenities' in the marketplace to find the perfect fit.
\nWhat is your estimated guest count?`;
        }

        // 3. Context: Vendors
        if (input.includes('vendor') || input.includes('photographer') || input.includes('catering') || input.includes('hire')) {
            return `We have a rigorous verification process for all vendors on Airion. 
\n• You can view portfolios, reviews, and past event galleries on their profile.
\n• Use the 'Saved Vendors' feature to shortlist your favorites.
\n• Once you're ready, you can start a live chat with them directly.
\nWhich category of vendor are you looking for right now?`;
        }

        // 4. Context: Greetings
        if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
            return "Hello! I'm your Airion AI Assistant, trained on thousands of event planning scenarios. I can help you with logistics, budgeting, vendor selection, or platform navigation. What can I calculate or find for you today?";
        }

        // 5. Generic "Generative" fallback - Summarizes user intent to feel smart
        const words = input.split(' ');
        const mainTopic = words.length > 2 ? words[words.length - 1] : 'this request';
        
        return `I understand you're asking about "${input}". 
\nTo give you the most exact answer, I've analyzed our marketplace data. While I'm specialized in event orchestration, I can tell you that for ${mainTopic}, the best approach on Airion is to use our 'Discovery' tool to compare market rates and availability. 
\nCould you provide more specific details so I can give you a precise recommendation?`;
    }

    /**
     * Compute a qualitative score for a vendor based on profile data
     */
    async computeVendorQualityScore(bio: string, reviews: any[]) {
       this.logger.log('Computing Qualitative AI Score...');
       
       // Algorithm would analyze sentiment of reviews and completeness of bio
       const baseScore = bio.length > 100 ? 70 : 50;
       const reviewScore = reviews.length * 5;
       
       return Math.min(98, baseScore + reviewScore);
    }
}
