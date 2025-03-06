import React, { useState } from 'react';
import axios from 'axios';

const FillInTheBlank: React.FC = () => {
  const [sentence, setSentence] = useState('');
  const [blankWord, setBlankWord] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [completeSentence, setCompleteSentence] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sentence) {
      setError('Please enter a sentence');
      return;
    }
    
    if (!sentence.includes('_')) {
      setError('Please include a blank space using "_" in your sentence');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:8000/fill-mask', {
        text: sentence.replace('_', '<mask>')
      });
      
      setSuggestions(response.data);
      setIsLoading(false);
      
      if (response.data.length > 0) {
        setBlankWord(response.data[0]);
        setCompleteSentence(sentence.replace('_', response.data[0]));
      }
    } catch (error) {
      setError('Error fetching suggestions');
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (word: string) => {
    setBlankWord(word);
    setCompleteSentence(sentence.replace('_', word));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Fill in the Blank</h2>
      <p className="text-gray-600 mb-6">
        Enter a Nepali sentence with a blank space (represented by "_____") and our model will suggest the most appropriate words to fill it.
      </p>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="sentence" className="block text-sm font-medium text-gray-700 mb-1">
            Enter a sentence with a blank (use "_____" for the blank)
          </label>
          <textarea
            id="sentence"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="हाम्रो _____ वर्षको प्रोजेक्टको नमूना"
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Get Suggestions'}
        </button>
      </form>
      
      {suggestions.length > 0 && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Suggested Words</h3>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSuggestion(word)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    blankWord === word
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Completed Sentence</h3>
            <p className="text-gray-700">{completeSentence}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default FillInTheBlank;