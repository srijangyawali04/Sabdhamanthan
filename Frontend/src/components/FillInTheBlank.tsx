import React, { useState } from 'react';
import axios from 'axios';

interface Suggestion {
  word: string;
  probability: number;
}

const FillInTheBlank: React.FC = () => {
  const [sentence, setSentence] = useState('');
  const [blankWord, setBlankWord] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
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
        text: sentence.replace('_', '<mask>'),
      });
  
      // Debugging: Log the response data to see its structure
      console.log('Response data:', response.data);
  
      // Check if response.data is an array of arrays with word and probability
      if (Array.isArray(response.data)) {
        // Sort by probability
        const sortedSuggestions = response.data
          .map((item: [string, number]) => ({
            word: item[0], // Extract word
            probability: item[1], // Extract probability
          }))
          .sort((a, b) => b.probability - a.probability); // Sort by highest probability
  
        // Log the sorted suggestions for debugging
        console.log('Sorted suggestions:', sortedSuggestions);
  
        setSuggestions(sortedSuggestions);
        setIsLoading(false);
  
        if (sortedSuggestions.length > 0) {
          setBlankWord(sortedSuggestions[0].word); // Set the highest probability word
          setCompleteSentence(sentence.replace('_', sortedSuggestions[0].word));
        }
      } else {
        console.error('Response data is not in the expected format:', response.data);
        setError('Unexpected response format');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
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
        Enter a Nepali sentence with a blank space (represented by "_") and our model will suggest the most appropriate words to fill it.
      </p>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="sentence" className="block text-sm font-medium text-gray-700 mb-1">
            Enter a sentence with a blank (use "_" for the blank )
          </label>
          <textarea
            id="sentence"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="हाम्रो _ वर्षको प्रोजेक्टको नमूना"
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
            <h3 className="text-lg font-medium text-gray-800 mb-2">Completed Sentence</h3>
            <p className="text-gray-700">
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