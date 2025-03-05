import React, { useState } from 'react';

type Entity = {
  text: string;
  type: string; // backend returns type as string
};

// type EntityType = 'O' | 'B-LOC' | 'B-PER' | 'B-ORG' | 'I-LOC' | 'I-PER' | 'I-ORG';

const entityColors: { [key: string]: string } = {
  'O': 'bg-blue-100 text-blue-800 border-blue-200',
  'B-LOC': 'bg-green-100 text-green-800 border-green-200',
  'B-PER': 'bg-purple-100 text-purple-800 border-purple-200',
  'B-ORG': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'I-LOC': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'I-PER': 'bg-pink-100 text-pink-800 border-pink-200',
  'I-ORG': 'bg-red-100 text-red-800 border-red-200',
  'OTHER': 'bg-gray-100 text-gray-800 border-gray-200' // Add a default color for 'OTHER'
};

const NamedEntityRecognition: React.FC = () => {
  const [text, setText] = useState('');
  const [entities, setEntities] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [processed, setProcessed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text) {
      setError('Please enter some Nepali text');
      return;
    }

    setIsLoading(true);
    setError('');
    setProcessed(false);

    try {
      const response = await fetch('http://localhost:8000/ner', { // replace `8000` with your backend port if different
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: Entity[] = await response.json();
      setEntities(data);
      setProcessed(true);
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      console.error("API request failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderProcessedText = () => {
    if (!processed || entities.length === 0) return null;

    let lastIndex = 0;
    const parts = [];

    entities.forEach((entity, index) => {
      const entityStart = text.indexOf(entity.text, lastIndex);
      const entityEnd = entityStart + entity.text.length;

      if (entityStart === -1) {
        return;
      }

      if (entityStart > lastIndex) {
        parts.push(
          <span key={`text-${index}`}>
            {text.substring(lastIndex, entityStart)}
          </span>
        );
      }

      parts.push(
        <span
          key={`entity-${index}`}
          className={`${entityColors[entity.type] || entityColors.OTHER} px-1 py-0.5 rounded border`}
          title={entity.type}
        >
          {entity.text}
        </span>
      );

      lastIndex = entityEnd;
    });

    if (lastIndex < text.length) {
      parts.push(
        <span key="text-end">
          {text.substring(lastIndex)}
        </span>
      );
    }

    return <div className="text-gray-800 leading-relaxed">{parts}</div>;
  };

  const getAllEntityTypes = () => {
    const types = new Set<string>(entities.map(entity => entity.type));
    return Array.from(types);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Named Entity Recognition</h2>
      <p className="text-gray-600 mb-6">
        Enter Nepali text and our model will identify and classify named entities such as people, organizations, locations, dates, and more.
      </p>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
            Enter Nepali text
          </label>
          <textarea
            id="text"
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="रामले गएको हप्ता काठमाडौंमा भएको त्रिभुवन विश्वविद्यालयको कार्यक्रममा भाग लिए। यो कार्यक्रम २०७८ साल असार महिनामा आयोजना गरिएको थियो।"
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
            'Identify Entities'
          )}
        </button>
      </form>

      {processed && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Identified Entities</h3>
            {renderProcessedText()}
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Entity Legend</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {getAllEntityTypes().map(type => (
                <div key={type} className="flex items-center">
                  <span className={`${entityColors[type] || entityColors.OTHER} px-2 py-1 rounded text-xs font-medium border mr-2`}>
                    {type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NamedEntityRecognition;
