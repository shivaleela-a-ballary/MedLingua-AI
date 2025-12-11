import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPreferences, setShowPreferences] = useState(true);
  const [age, setAge] = useState('');
  const [language, setLanguage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'mr', name: 'मराठी (Marathi)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
    { code: 'ml', name: 'മലയാളം (Malayalam)' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
    { code: 'or', name: 'ଓଡ଼ିଆ (Odia)' },
    { code: 'as', name: 'অসমীয়া (Assamese)' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const savedAge = localStorage.getItem('userAge');
    const savedLang = localStorage.getItem('userLanguage');
    
    if (savedAge && savedLang) {
      setAge(savedAge);
      setLanguage(savedLang);
      setShowPreferences(false);
      setMessages([{ role: 'ai', content: getWelcomeMessage(savedLang) }]);
    }
  }, []);

  const handlePreferencesSubmit = () => {
    if (!age || !language) {
      alert('Please select both age and language');
      return;
    }
    localStorage.setItem('userAge', age);
    localStorage.setItem('userLanguage', language);
    setShowPreferences(false);
    const welcomeMsg = getWelcomeMessage(language);
    setMessages([{ role: 'ai', content: welcomeMsg }]);
  };

  const getWelcomeMessage = (lang) => {
    const welcomes = {
      en: `Hello! I'm MedLingua AI, your health assistant. I can help you with:\n\n✓ Health queries in your language\n✓ Voice input support\n✓ Medical report analysis\n✓ Doctor recommendations\n\nHow can I assist you today?`,
      hi: `नमस्ते! मैं मेडलिंगुआ AI हूं, आपका स्वास्थ्य सहायक। मैं आपकी मदद कर सकता हूं:\n\n✓ आपकी भाषा में स्वास्थ्य प्रश्न\n✓ आवाज इनपुट समर्थन\n✓ मेडिकल रिपोर्ट विश्लेषण\n✓ डॉक्टर की सिफारिशें\n\nआज मैं आपकी कैसे मदद कर सकता हूं?`,
      kn: `ನಮಸ್ಕಾರ! ನಾನು ಮೆಡ್ಲಿಂಗುವಾ AI, ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಹಾಯಕ. ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ:\n\n✓ ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಆರೋಗ್ಯ ಪ್ರಶ್ನೆಗಳು\n✓ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಬೆಂಬಲ\n✓ ವೈದ್ಯಕೀಯ ವರದಿ ವಿಶ್ಲೇಷಣೆ\n✓ ವೈದ್ಯರ ಶಿಫಾರಸುಗಳು\n\nಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?`,
      mr: `नमस्कार! मी मेडलिंग्वा AI आहे, तुमचा आरोग्य सहाय्यक. मी तुम्हाला मदत करू शकतो:\n\n✓ तुमच्या भाषेत आरोग्य प्रश्न\n✓ आवाज इनपुट समर्थन\n✓ वैद्यकीय अहवाल विश्लेषण\n✓ डॉक्टर शिफारसी\n\nआज मी तुम्हाला कशी मदत करू शकतो?`,
      te: `నమస్కారం! నేను మెడ్లింగువా AI, మీ ఆరోగ్య సహాయకుడిని. నేను మీకు సహాయం చేయగలను:\n\n✓ మీ భాషలో ఆరోగ్య ప్రశ్నలు\n✓ వాయిస్ ఇన్‌పుట్ మద్దతు\n✓ వైద్య నివేదిక విశ్లేషణ\n✓ వైద్యుల సిఫార్సులు\n\nఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?`,
      ta: `வணக்கம்! நான் மெட்லிங்குவா AI, உங்கள் சுகாதார உதவியாளர். நான் உங்களுக்கு உதவ முடியும்:\n\n✓ உங்கள் மொழியில் சுகாதார கேள்விகள்\n✓ குரல் உள்ளீடு ஆதரவு\n✓ மருத்துவ அறிக்கை பகுப்பாய்வு\n✓ மருத்துவர் பரிந்துரைகள்\n\nஇன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?`,
    };
    return welcomes[lang] || welcomes.en;
  };

  const getDoctorRecommendation = (message) => {
    const doctors = {
      gynec: { name: "Dr. Priya Sharma", specialty: "Gynecology", hospital: "District Hospital, Belagavi", phone: "0831-2401234" },
      cardio: { name: "Dr. Rajesh Kumar", specialty: "Cardiology", hospital: "KLE Hospital, Belagavi", phone: "0831-2445678" },
      ortho: { name: "Dr. Amit Patil", specialty: "Orthopedics", hospital: "BIMS Hospital, Belagavi", phone: "0831-2556789" },
      pediatric: { name: "Dr. Sneha Reddy", specialty: "Pediatrics", hospital: "Ashwini Hospital, Belagavi", phone: "0831-2667890" },
      derma: { name: "Dr. Anita Desai", specialty: "Dermatology", hospital: "Skin Care Clinic, Belagavi", phone: "0831-2778901" },
    };

    const msgLower = message.toLowerCase();
    
    if (msgLower.includes('gynec') || msgLower.includes('women') || msgLower.includes('pregnancy') || msgLower.includes('period')) {
      return doctors.gynec;
    } else if (msgLower.includes('heart') || msgLower.includes('cardio') || msgLower.includes('chest pain') || msgLower.includes('blood pressure')) {
      return doctors.cardio;
    } else if (msgLower.includes('bone') || msgLower.includes('ortho') || msgLower.includes('fracture') || msgLower.includes('joint')) {
      return doctors.ortho;
    } else if (msgLower.includes('child') || msgLower.includes('baby') || msgLower.includes('pediatric') || msgLower.includes('kid')) {
      return doctors.pediatric;
    } else if (msgLower.includes('skin') || msgLower.includes('rash') || msgLower.includes('acne') || msgLower.includes('derma')) {
      return doctors.derma;
    }
    
    return null;
  };

  const callGeminiAPI = async (userMessage, hasImage = false) => {
  const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
  
  console.log('Groq API Key loaded:', GROQ_API_KEY ? 'Yes' : 'No');
  
  if (!GROQ_API_KEY) {
    return "⚠️ API key not configured. Please add REACT_APP_GROQ_API_KEY to your .env file.";
  }

  const languageNames = {
    en: 'English',
    hi: 'Hindi',
    kn: 'Kannada',
    mr: 'Marathi',
    te: 'Telugu',
    ta: 'Tamil',
    gu: 'Gujarati',
    bn: 'Bengali',
    ml: 'Malayalam',
    pa: 'Punjabi',
    or: 'Odia',
    as: 'Assamese',
  };

  const systemPrompt = `You are MedLingua AI, a professional and compassionate multilingual healthcare assistant helping patients in India.

Patient Profile:
- Age: ${age} years old
- Preferred Language: ${languageNames[language] || 'English'}
${hasImage ? '- Has attached a medical report/image for analysis' : ''}

CRITICAL INSTRUCTIONS - FOLLOW EXACTLY:
1. LANGUAGE: You MUST respond ENTIRELY in ${languageNames[language] || 'English'} language. Use natural, conversational ${languageNames[language] || 'English'}.
2. LENGTH: Provide detailed responses of 120-200 words. Do NOT give short or incomplete answers.
3. STRUCTURE: Use clear paragraphs and bullet points (•) for better readability.
4. TONE: Be warm, empathetic, and professional like a real doctor.
5. MEDICAL ADVICE: 
   - Explain symptoms clearly
   - Provide practical home remedies when appropriate
   - Include lifestyle recommendations
   - Always mention when to see a doctor
6. AGE-APPROPRIATE: Tailor advice based on the patient's age (${age} years).
7. COMPLETENESS: Always finish your sentences and thoughts completely.

Remember: Give complete, helpful, natural-sounding advice in ${languageNames[language] || 'English'} language.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.8,
        max_tokens: 800,
        top_p: 0.9,
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content;
    } else if (data.error) {
      console.error('Groq API Error:', data.error);
      return `API Error: ${data.error.message || 'Please check your API key.'}`;
    } else {
      return "Sorry, I received an unexpected response. Please try again.";
    }
  } catch (error) {
    console.error('API Error:', error);
    return "Sorry, I'm having trouble connecting. Please try again later.";
  }
};

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = language === 'en' ? 'en-IN' : `${language}-IN`;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      alert('Could not recognize speech. Please try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        alert('File size should be less than 5MB');
        return;
      }
      setSelectedImage(file);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMessage = input.trim();
    const hasImage = selectedImage !== null;
    
    setInput('');
    setLoading(true);

    const userMsg = hasImage 
      ? `${userMessage}\n\n📎 [Medical Report Image Attached]` 
      : userMessage;
    
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setSelectedImage(null);

    const aiResponse = await callGeminiAPI(userMessage, hasImage);
    
    const doctor = getDoctorRecommendation(userMessage);
    let finalResponse = aiResponse;
    
    if (doctor && !hasImage) {
      finalResponse += `\n\n━━━━━━━━━━━━━━━━━━━━\n\n**🏥 Recommended Specialist in Belagavi:**\n\n👨‍⚕️ **${doctor.name}**\n🩺 ${doctor.specialty}\n🏨 ${doctor.hospital}\n📞 ${doctor.phone}\n\nYou can book an appointment with this specialist.`;
    }

    setMessages(prev => [...prev, { role: 'ai', content: finalResponse }]);
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (showPreferences) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-blue-50 to-white p-4">
        <div className="card max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Setup Your Preferences
            </h2>
            <p className="text-gray-600 text-sm">Help us personalize your experience</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
                min="1"
                max="120"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="input-field"
              >
                <option value="">Select Language</option>
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePreferencesSubmit}
              className="btn-primary w-full"
            >
              Continue to Chat →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="bg-white border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              MedLingua AI Chatbot
            </h1>
            <p className="text-sm text-gray-600">
              Age: {age} | Language: {languages.find(l => l.code === language)?.name}
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('userAge');
              localStorage.removeItem('userLanguage');
              setShowPreferences(true);
              setMessages([]);
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            ⚙️ Change Settings
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
              <p className="whitespace-pre-line">{msg.content}</p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="chat-bubble-ai">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t px-6 py-4">
        {selectedImage && (
          <div className="mb-3 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg p-2">
            <span className="text-sm text-emerald-700">📎 {selectedImage.name}</span>
            <button
              onClick={() => setSelectedImage(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        )}
        
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Upload medical report"
          >
            📎
          </button>
          
          <button
            onClick={startVoiceInput}
            disabled={isListening}
            className={`px-4 py-3 rounded-lg transition-colors ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            title="Voice input"
          >
            {isListening ? '🎤' : '🎙️'}
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your health query here..."
            className="input-field flex-1"
            disabled={loading}
          />
          
          <button
            onClick={handleSendMessage}
            disabled={loading || (!input.trim() && !selectedImage)}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-6"
          >
            Send
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          💡 Use voice 🎙️, text ⌨️, or upload report 📎 | Ask in your preferred language
        </p>
      </div>
    </div>
  );
}

export default Chatbot;
