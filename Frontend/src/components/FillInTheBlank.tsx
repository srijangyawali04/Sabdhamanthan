import React, { useState } from 'react';

const FillInTheBlank: React.FC = () => {
  const [sentence, setSentence] = useState('');
  const [blankWord, setBlankWord] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [completeSentence, setCompleteSentence] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
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
    
    // Simulate API call
    setTimeout(() => {
      // Mock response
      const mockSuggestions = [
        'राम्रो', 'सुन्दर', 'ठूलो', 'सानो', 'नयाँ'
      ];
      setSuggestions(mockSuggestions);
      setIsLoading(false);
      
      // Set the first suggestion as the selected word
      setBlankWord(mockSuggestions[0]);
      
      // Set a default complete sentence with the first suggestion
      setCompleteSentence(sentence.replace('_', mockSuggestions[0]));
    }, 1000);
  };

  const handleSelectSuggestion = (word: string) => {
    setBlankWord(word);
    setCompleteSentence(sentence.replace('_', word));
  };

  const getFilledSentence = () => {
    if (!blankWord) return sentence;
    return sentence.replace('_', `<strong class="text-indigo-600">${blankWord}</strong>`);
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
            Enter a sentence with a blank (use "_" for the blank)
          </label>
          <textarea
            id="sentence"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="यो एउटा _ घर हो।"
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
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Get Suggestions'
          )}
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
            <p 
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: getFilledSentence() }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default FillInTheBlank;
