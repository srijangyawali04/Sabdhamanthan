import React, { useState } from 'react';
import axios from 'axios';

interface Suggestion {
  word: string;
  probability: number;
}

interface LanguageText {
  title: string;
  description: string;
  inputLabel: string;
  placeholder: string;
  errorEmpty: string;
  errorNoBlank: string;
  errorNotNepali: string;
  errorUnexpectedResponse: string;
  errorFetchingSuggestions: string;
  buttonProcessing: string;
  buttonGetSuggestions: string;
  suggestedWords: string;
  completedSentence: string;
  languageToggle: string;
  englishLabel: string;
  nepaliLabel: string;
}

const FillInTheBlank: React.FC = () => {
  const [sentence, setSentence] = useState('');
  const [blankWord, setBlankWord] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [completeSentence, setCompleteSentence] = useState('');
  const [isNepaliUI, setIsNepaliUI] = useState(false);

  // Language text resources
  const languageText: { nepali: LanguageText, english: LanguageText } = {
    nepali: {
      title: 'रिक्त स्थान भर्नुहोस्',
      description: 'खाली ठाउँ (" _ " द्वारा प्रतिनिधित्व) भएको नेपाली वाक्य लेख्नुहोस् र हाम्रो मोडेलले यसलाई भर्न उपयुक्त शब्दहरू सुझाव दिनेछ।',
      inputLabel: 'खाली ठाउँ सहितको वाक्य लेख्नुहोस् (खाली ठाउँको लागि " _ " प्रयोग गर्नुहोस्)',
      placeholder: 'हाम्रो _ वर्षको प्रोजेक्टको नमूना',
      errorEmpty: 'कृपया एउटा वाक्य लेख्नुहोस्',
      errorNoBlank: 'कृपया वाक्यमा " _ " प्रयोग गरेर खाली ठाउँ राख्नुहोस्',
      errorNotNepali: 'कृपया नेपाली भाषामा मात्र लेख्नुहोस्।',
      errorUnexpectedResponse: 'अप्रत्याशित प्रतिक्रिया ढाँचा',
      errorFetchingSuggestions: 'सुझावहरू प्राप्त गर्न त्रुटि भयो',
      buttonProcessing: 'प्रक्रिया हुँदैछ...',
      buttonGetSuggestions: 'सुझावहरू प्राप्त गर्नुहोस्',
      suggestedWords: 'सुझाव गरिएका शब्दहरू',
      completedSentence: 'पूरा वाक्य',
      languageToggle: 'English UI',
      englishLabel: 'English',
      nepaliLabel: 'नेपाली'
    },
    english: {
      title: 'Fill in the Blank',
      description: 'Enter a Nepali sentence with a blank space (represented by " _ ") and our model will suggest the most appropriate words to fill it.',
      inputLabel: 'Enter a sentence with a blank (use " _ " for the blank)',
      placeholder: 'हाम्रो _ वर्षको प्रोजेक्टको नमूना',
      errorEmpty: 'Please enter a sentence',
      errorNoBlank: 'Please include a blank space using " _ " in your sentence',
      errorNotNepali: 'Please enter text in Nepali language.',
      errorUnexpectedResponse: 'Unexpected response format',
      errorFetchingSuggestions: 'Error fetching suggestions',
      buttonProcessing: 'Processing...',
      buttonGetSuggestions: 'Get Suggestions',
      suggestedWords: 'Suggested Words',
      completedSentence: 'Completed Sentence',
      languageToggle: 'नेपाली UI',
      englishLabel: 'English',
      nepaliLabel: 'नेपाली'
    }
  };

  // Get current language text
  const text = isNepaliUI ? languageText.nepali : languageText.english;

  // Function to check if text is in Nepali
  const isNepaliText = (text: string): boolean => {
    // Check for Nepali Unicode range (0900-097F for Devanagari)
    // Allow for underscore, spaces, and punctuation
    const nepaliPattern = /^[\u0900-\u097F\s_.,!?।-]+$/;
    
    // Remove underscores, spaces, and common punctuation for the check
    const textToCheck = text.replace(/[_\s.,!?।-]/g, '');
    
    // Text must contain at least one Nepali character
    return nepaliPattern.test(text) && textToCheck.length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sentence) {
      setError(text.errorEmpty);
      return;
    }
    
    if (!sentence.includes('_')) {
      setError(text.errorNoBlank);
      return;
    }

    // Check if the input is in Nepali
    if (!isNepaliText(sentence)) {
      setError(text.errorNotNepali);
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://34.198.228.140:8000/fill-mask', {
        text: sentence.replace('_', '<mask>'),
      });
  
  
      // Check if response.data is an array of arrays with word and probability
      if (Array.isArray(response.data)) {
        // Sort by probability
        const sortedSuggestions = response.data
          .map((item: [string, number]) => ({
            word: item[0], // Extract word
            probability: item[1], // Extract probability
          }))
          .sort((a, b) => b.probability - a.probability); // Sort by highest probability
  
  
        setSuggestions(sortedSuggestions);
        setIsLoading(false);
  
        if (sortedSuggestions.length > 0) {
          setBlankWord(sortedSuggestions[0].word); // Set the highest probability word
          setCompleteSentence(sentence.replace('_', sortedSuggestions[0].word));
        }
      } else {
        console.error('Response data is not in the expected format:', response.data);
        setError(text.errorUnexpectedResponse);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setError(text.errorFetchingSuggestions);
      setIsLoading(false);
    }
  };
  
  const handleSelectSuggestion = (word: string) => {
    setBlankWord(word);
    setCompleteSentence(sentence.replace('_', word));
  };

  const toggleLanguage = () => {
    setIsNepaliUI(!isNepaliUI);
  };
  
  return (
    <div className="relative">
      {/* Language toggle button */}
      <div className="absolute top-0 right-0 flex items-center">
        <span className={`mr-2 text-sm ${!isNepaliUI ? 'font-medium' : 'text-gray-500'}`}>
          {languageText.english.englishLabel}
        </span>
        <div 
          onClick={toggleLanguage}
          className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          style={{ backgroundColor: isNepaliUI ? '#4F46E5' : '#D1D5DB' }}
        >
          <span className="sr-only">{text.languageToggle}</span>
          <span 
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isNepaliUI ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </div>
        <span className={`ml-2 text-sm ${isNepaliUI ? 'font-medium' : 'text-gray-500'}`}>
          {languageText.nepali.nepaliLabel}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">{text.title}</h2>
      <p className="text-gray-600 mb-6">
        {text.description}
      </p>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="sentence" className="block text-sm font-medium text-gray-700 mb-1">
            {text.inputLabel}
          </label>
          <textarea
            id="sentence"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={text.placeholder}
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            dir="auto"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? text.buttonProcessing : text.buttonGetSuggestions}
        </button>
      </form>
      
      {suggestions.length > 0 && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">{text.suggestedWords}</h3>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSuggestion(item.word)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    blankWord === item.word
                      ? 'bg-indigo-600 text-white'
                      : item.word === suggestions[0].word // Highest probability word
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-200 text-black hover:bg-blue-600'
                  }`}
                >
                  {item.word}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium text-gray-800 mb-2">{text.completedSentence}</h3>
            <p className="text-gray-700" dir="auto">
            {completeSentence
              .split(' ') 
              .reduce((acc: JSX.Element[], word, index, arr) => {
                // Check if word contains the selected blank word
                const isSelectedWord = word === blankWord;
                const isHighestProbabilityWord = blankWord === suggestions[0].word && isSelectedWord;
                
                if (word.includes('##') && index > 0) {
                  // For concatenated words
                  acc[acc.length - 1] = (
                    <span key={index} className={`${
                      isSelectedWord 
                        ? isHighestProbabilityWord 
                          ? 'text-green-600 font-semibold' 
                          : 'text-blue-600 font-semibold'
                        : ''
                    }`}>
                      {arr[index - 1]}{word.replace('##', '')}
                      {index < arr.length - 1 && ' '} 
                    </span>
                  );
                  return acc;
                }
                
                // For regular words
                acc.push(
                  <span
                    key={index}
                    className={`${
                      isSelectedWord 
                        ? isHighestProbabilityWord 
                          ? 'text-green-600 font-semibold' 
                          : 'text-blue-600 font-semibold'
                        : ''
                    }`}
                  >
                    {word}
                    {index < arr.length - 1 && ' '}
                  </span>
                );
                return acc;
              }, [])}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default FillInTheBlank;