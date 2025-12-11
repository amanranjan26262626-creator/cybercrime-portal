import google.generativeai as genai
import os
from typing import Dict, Any

class AIService:
    def __init__(self):
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError('GEMINI_API_KEY not found')
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
    
    def analyze_complaint(self, text: str, language: str = 'hi') -> Dict[str, Any]:
        """Advanced NLP analysis of complaint text"""
        prompt = self._get_analysis_prompt(text, language)
        
        try:
            response = self.model.generate_content(prompt)
            return self._parse_analysis(response.text)
        except Exception as e:
            return {'error': str(e)}
    
    def _get_analysis_prompt(self, text: str, language: str) -> str:
        """Generate analysis prompt based on language"""
        prompts = {
            'hi': f"""निम्नलिखित साइबर अपराध शिकायत का विश्लेषण करें:
{text}

निम्नलिखित जानकारी निकालें:
1. अपराध का प्रकार
2. वित्तीय नुकसान (यदि कोई हो)
3. तारीख और समय
4. स्थान
5. गंभीरता स्कोर (0-100)
6. सारांश

JSON format में जवाब दें।""",
            'en': f"""Analyze the following cybercrime complaint:
{text}

Extract:
1. Crime type
2. Financial loss (if any)
3. Date and time
4. Location
5. Severity score (0-100)
6. Summary

Respond in JSON format."""
        }
        return prompts.get(language, prompts['en'])
    
    def _parse_analysis(self, response: str) -> Dict[str, Any]:
        """Parse AI response into structured data"""
        # Simple parsing - can be enhanced
        return {
            'raw_response': response,
            'parsed': True
        }

