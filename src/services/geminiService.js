// Gemini AI Service for Retinal-AI Platform
class GeminiService {
  constructor() {
    this.apiKey = 'AIzaSyB2Zu0VF0OdUFCBN5K3MiVI4DJN61Ggj8M';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    this.isAvailable = true;
    
    // Medical context for retinal health
    this.medicalContext = `You are an AI assistant for a retinal disease diagnosis platform called "Retinal-AI". 
    You specialize in providing educational information about eye health, retinal diseases, and general medical guidance.
    
    Key areas of expertise:
    - Diabetic Retinopathy (DR)
    - Age-related Macular Degeneration (AMD)
    - Choroidal Neovascularization (CNV)
    - Diabetic Macular Edema (DME)
    - Drusen and retinal deposits
    - General eye health and prevention
    
    Important guidelines:
    - Always emphasize that you provide educational information only
    - Recommend consulting with qualified ophthalmologists for medical diagnosis
    - Be accurate and evidence-based in your responses
    - Keep responses concise but informative
    - Use professional medical terminology when appropriate
    - Provide practical advice for eye health maintenance`;
  }

  async generateResponse(userMessage, context = []) {
    try {
      if (!this.isAvailable) {
        throw new Error('Gemini API service is not available');
      }

      // Prepare the conversation context
      const conversationHistory = context.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [{ text: this.medicalContext }]
          },
          ...conversationHistory,
          {
            role: 'user',
            parts: [{ text: userMessage }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
          stopSequences: []
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      };

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        const responseText = data.candidates[0].content.parts[0].text;
        return {
          success: true,
          response: responseText,
          finishReason: data.candidates[0].finishReason
        };
      } else {
        throw new Error('No response generated from Gemini API');
      }

    } catch (error) {
      console.error('Gemini API error:', error);
      return {
        success: false,
        error: error.message,
        fallbackResponse: this.getFallbackResponse(userMessage)
      };
    }
  }

  getFallbackResponse(userMessage) {
    // Fallback responses for common medical questions
    const fallbackResponses = {
      'retinopathy': 'Diabetic retinopathy is a serious eye condition caused by diabetes that affects blood vessels in the retina. Early detection through regular eye exams is crucial. Please consult with an ophthalmologist for proper evaluation.',
      'macular': 'Age-related macular degeneration (AMD) affects central vision and is more common in people over 50. Symptoms include blurred or distorted central vision. Regular eye exams and lifestyle modifications can help manage the condition.',
      'drusen': 'Drusen are yellow deposits beneath the retina that may indicate early stages of AMD. Small drusen are common with aging, while large drusen may require monitoring and treatment.',
      'cnv': 'Choroidal neovascularization involves abnormal blood vessel growth beneath the retina, often associated with wet AMD. This condition requires prompt medical attention and treatment.',
      'eye health': 'Maintaining good eye health involves regular comprehensive eye exams, protecting eyes from UV radiation, maintaining a healthy diet rich in antioxidants, not smoking, and managing underlying health conditions like diabetes and hypertension.',
      'symptoms': 'Common retinal disease symptoms include blurred vision, floaters, flashes of light, dark spots, and loss of peripheral vision. Any sudden changes in vision warrant immediate medical attention.'
    };

    const lowerMessage = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(fallbackResponses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    return 'I apologize, but I\'m experiencing technical difficulties. For medical questions about retinal health, please consult with a qualified ophthalmologist. In the meantime, I recommend regular comprehensive eye exams and maintaining overall eye health through proper nutrition and UV protection.';
  }

  async analyzeRetinalImage(imageDescription, analysisResults) {
    try {
      const prompt = `As an AI assistant for retinal disease diagnosis, provide an educational explanation of the following analysis results:

Analysis Results:
- Primary Diagnosis: ${analysisResults.primaryDiagnosis?.condition || 'Not specified'}
- Confidence: ${analysisResults.primaryDiagnosis?.confidence || 'Not specified'}%
- Severity: ${analysisResults.primaryDiagnosis?.severity || 'Not specified'}

Please explain:
1. What this condition means in simple terms
2. Common symptoms patients might experience
3. General treatment approaches (educational only)
4. Importance of follow-up care

Keep the explanation educational and emphasize the need for professional medical consultation.`;

      const result = await this.generateResponse(prompt);
      return result.success ? result.response : result.fallbackResponse;

    } catch (error) {
      console.error('Error analyzing retinal image with Gemini:', error);
      return 'I apologize, but I cannot provide analysis at this time. Please consult with your ophthalmologist to discuss these results in detail.';
    }
  }

  getQuickHealthTips() {
    return [
      "Regular eye exams can detect retinal diseases before symptoms appear",
      "A diet rich in leafy greens and fish supports retinal health",
      "UV protection helps prevent retinal damage",
      "Managing diabetes and blood pressure reduces retinal disease risk",
      "The 20-20-20 rule helps reduce digital eye strain"
    ];
  }
}

export const geminiService = new GeminiService();