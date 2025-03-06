import React, { useState } from 'react';

type POSTag = {
  word: string;
  tag: string;
  description: string;
};

const posColors: Record<string, string> = {
  'CD': 'bg-cyan-200 text-cyan-900 border-cyan-300',            // Cardinal Number
  'JJ': 'bg-orange-200 text-orange-900 border-orange-300',       // Adjective
  'NNP': 'bg-green-200 text-green-900 border-green-300',         // Proper Noun
  'POP': 'bg-green-200 text-green-900 border-green-300',         // Proper Noun
  'NN': 'bg-blue-200 text-blue-900 border-blue-300',             // Common Noun
  'PKO': 'bg-teal-200 text-teal-900 border-teal-300',            // Postposition
  'VBX': 'bg-yellow-200 text-yellow-900 border-yellow-300',      // Infinitive Verb
  'YF': 'bg-yellow-200 text-yellow-900 border-yellow-300',       // Sentence-final Punctuation
  'FB': 'bg-amber-200 text-amber-900 border-amber-300',           // Abbreviation
  'VBF': 'bg-yellow-200 text-yellow-900 border-yellow-300',      // Finite Verb
  'PLAI': 'bg-orange-200 text-orange-900 border-orange-300',     // Plural Indefinite Adjective
  'DUM': 'bg-gray-200 text-gray-900 border-gray-300',            // Dummy
  'VBKO': 'bg-yellow-200 text-yellow-900 border-yellow-300',     // Aspect Verb
  'RBO': 'bg-red-200 text-red-900 border-red-300',               // Adverb
  'VBI': 'bg-yellow-200 text-yellow-900 border-yellow-300',      // Infinitive Verb
  'VBO': 'bg-yellow-200 text-yellow-900 border-yellow-300',      // Other Verb
  'HRU': 'bg-blue-200 text-blue-900 border-blue-300',            // Human or Referent
  'JJD': 'bg-orange-200 text-orange-900 border-orange-300',      // Degree Adjective
  'YM': 'bg-teal-200 text-teal-900 border-teal-300',             // Sentence-medial Punctuation
  'PLE': 'bg-lime-200 text-lime-900 border-lime-300',            // Plural/Exclusive
  'JJM': 'bg-orange-200 text-orange-900 border-orange-300',      // Marked Adjective
  'RP': 'bg-purple-200 text-purple-900 border-purple-300',        // Relative Pronoun
  'VBNE': 'bg-yellow-200 text-yellow-900 border-yellow-300',     // Non-finite Verb
  'CS': 'bg-pink-200 text-pink-900 border-pink-300',             // Subordinating Conjunction
  'YQ': 'bg-amber-200 text-amber-900 border-amber-300',           // Quotation Marks
  'CL': 'bg-cyan-200 text-cyan-900 border-cyan-300',             // Classifier
  'PP': 'bg-purple-200 text-purple-900 border-purple-300',        // Personal Pronoun
  'PP$': 'bg-purple-200 text-purple-900 border-purple-300',       // Possessive Pronoun
  'CC': 'bg-pink-200 text-pink-900 border-pink-300',             // Coordinating Conjunction
  'SYM': 'bg-gray-200 text-gray-900 border-gray-300',            // Symbol
  'PPR': 'bg-purple-200 text-purple-900 border-purple-300',       // Proper Pronoun
  'DM': 'bg-teal-200 text-teal-900 border-teal-300',             // Determiner
  'OD': 'bg-yellow-200 text-yellow-900 border-yellow-300',       // Object
  'QW': 'bg-red-200 text-red-900 border-red-300',                // Wh-Question Word
  'UNW': 'bg-gray-200 text-gray-900 border-gray-300',            // Unclassified Word
  'RBM': 'bg-red-200 text-red-900 border-red-300',               // Modal Adverb
  'FW': 'bg-blue-200 text-blue-900 border-blue-300',             // Foreign Word
  'YB': 'bg-amber-200 text-amber-900 border-amber-300',           // Brackets
  'ALPH': 'bg-cyan-200 text-cyan-900 border-cyan-300'             // Alphabet
};

const posDescriptions: Record<string, string> = {
  'CD': 'Cardinal Number',
  'JJ': 'Adjective',
  'NNP': 'Proper Noun',
  'POP': 'Proper Noun',
  'NN': 'Common Noun',
  'PKO': 'Postposition',
  'VBX': 'Infinitive Verb',
  'YF': 'Sentence-final Punctuation',
  'FB': 'Abbreviation',
  'VBF': 'Finite Verb',
  'PLAI': 'Plural Indefinite Adjective',
  'DUM': 'Dummy',
  'VBKO': 'Aspect Verb',
  'RBO': 'Adverb',
  'VBI': 'Infinitive Verb',
  'VBO': 'Other Verb',
  'HRU': 'Human or Referent',
  'JJD': 'Degree Adjective',
  'YM': 'Sentence-medial Punctuation',
  'PLE': 'Plural/Exclusive',
  'JJM': 'Marked Adjective',
  'RP': 'Relative Pronoun',
  'VBNE': 'Non-finite Verb',
  'CS': 'Subordinating Conjunction',
  'YQ': 'Quotation Marks',
  'CL': 'Classifier',
  'PP': 'Personal Pronoun',
  'PP$': 'Possessive Pronoun',
  'CC': 'Coordinating Conjunction',
  'SYM': 'Symbol',
  'PPR': 'Proper Pronoun',
  'DM': 'Determiner',
  'OD': 'Object',
  'QW': 'Wh-Question Word',
  'UNW': 'Unclassified Word',
  'RBM': 'Modal Adverb',
  'FW': 'Foreign Word',
  'YB': 'Brackets',
  'ALPH': 'Alphabet'
};


const PartsOfSpeech: React.FC = () => {
  const [text, setText] = useState('');
  const [posTags, setPosTags] = useState<POSTag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [processed, setProcessed] = useState(false);

  const isNepaliText = (inputText: string): boolean => {
    // This regex checks if the input text contains Devanagari script characters,
    // which are commonly used in Nepali.
    const nepaliRegex = /[\u0900-\u097F]/;
    return nepaliRegex.test(inputText);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text) {
      setError('Please enter some Nepali text');
      return;
    }

    if (!isNepaliText(text)) {
      setError('Please enter text in Nepali language.');
      setIsLoading(false);
      setProcessed(false);
      setPosTags([]);
      return;
    }

    setIsLoading(true);
    setError('');
    setProcessed(false);

    try {
      const response = await fetch('http://localhost:8000/pos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: { text: string; type: string }[] = await response.json();

      const enrichedData: POSTag[] = data.map(item => ({
        word: item.text,
        tag: item.type,
        description: posDescriptions[item.type] 
      }));
      setPosTags(enrichedData);
      setProcessed(true);
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      console.error("API request failed:", err);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(posTags);

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
