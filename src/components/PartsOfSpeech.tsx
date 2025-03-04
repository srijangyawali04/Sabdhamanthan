import React, { useState } from 'react';

type POSTag = {
  word: string;
  tag: string;
  description: string;
};

const posColors: Record<string, string> = {
  'NN': 'bg-blue-100 text-blue-800 border-blue-200',
  'NNP': 'bg-blue-100 text-blue-800 border-blue-200',
  'PRP': 'bg-green-100 text-green-800 border-green-200',
  'VB': 'bg-purple-100 text-purple-800 border-purple-200',
  'JJ': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'RB': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'IN': 'bg-pink-100 text-pink-800 border-pink-200',
  'CC': 'bg-red-100 text-red-800 border-red-200',
  'DT': 'bg-orange-100 text-orange-800 border-orange-200',
  'CD': 'bg-teal-100 text-teal-800 border-teal-200',
  'OTHER': 'bg-gray-100 text-gray-800 border-gray-200'
};

const posDescriptions: Record<string, string> = {
  'NN': 'Common Noun',
  'NNP': 'Proper Noun',
  'PRP': 'Pronoun',
  'VB': 'Verb',
  'JJ': 'Adjective',
  'RB': 'Adverb',
  'IN': 'Preposition',
  'CC': 'Conjunction',
  'DT': 'Determiner',
  'CD': 'Cardinal Number',
  'OTHER': 'Other'
};

const PartsOfSpeech: React.FC = () => {
  const [text, setText] = useState('');
  const [posTags, setPosTags] = useState<POSTag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [processed, setProcessed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text) {
      setError('Please enter some Nepali text');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setProcessed(false);
    
    // Simulate API call
    setTimeout(() => {
      // Mock response - splitting the text by spaces and assigning random POS tags
      const words = text.split(/\s+/);
      const tags = ['NN', 'NNP', 'PRP', 'VB', 'JJ', 'RB', 'IN', 'CC', 'DT', 'CD'];
      
      const mockPosTags: POSTag[] = words.map(word => {
        const randomTag = tags[Math.floor(Math.random() * tags.length)];
        return {
          word,
          tag: randomTag,
          description: posDescriptions[randomTag] || 'Unknown'
        };
      });
      
      setPosTags(mockPosTags);
      setIsLoading(false);
      setProcessed(true);
    }, 1000);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Parts of Speech Tagging</h2>
      <p className="text-gray-600 mb-6">
        Enter Nepali text and our model will analyze and tag each word with its appropriate part of speech.
      </p>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="pos-text" className="block text-sm font-medium text-gray-700 mb-1">
            Enter Nepali text
          </label>
          <textarea
            id="pos-text"
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="मैले हिजो राम्रो किताब पढें। त्यो किताब मेरो साथीले मलाई दिएको थियो।"
            value={text}
            onChange={(e) => setText(e.target.value)}
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
            'Analyze Text'
          )}
        </button>
      </form>
      
      {processed && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Tagged Words</h3>
            <div className="flex flex-wrap gap-2">
              {posTags.map((item, index) => (
                <div 
                  key={index} 
                  className={`${posColors[item.tag] || posColors.OTHER} px-2 py-1 rounded border relative group`}
                >
                  <span>{item.word}</span>
                  <span className="ml-1 text-xs font-bold opacity-70">{item.tag}</span>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap">
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">POS Tag Legend</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {Object.entries(posDescriptions).map(([tag, description]) => (
                <div key={tag} className="flex items-center">
                  <span className={`${posColors[tag] || posColors.OTHER} px-2 py-1 rounded text-xs font-medium border mr-2`}>
                    {tag}
                  </span>
                  <span className="text-sm text-gray-700">{description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartsOfSpeech;