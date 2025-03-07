import React, { useState } from 'react';
import axios from 'axios';

type Entity = {
    text: string;
    type: string;
};

interface LanguageText {
    title: string;
    description: string;
    inputLabel: string;
    placeholder: string;
    errorEmpty: string;
    errorNotNepali: string;
    errorFetchingEntities: string;
    buttonProcessing: string;
    buttonIdentifyEntities: string;
    identifiedEntities: string;
    entityLegend: string;
}

const entityColors: { [key: string]: string } = {
    'O': 'bg-blue-200 text-blue-900 border-blue-300',          // Other
    'B-LOC': 'bg-green-200 text-green-900 border-green-300',    // Beginning of Location
    'B-PER': 'bg-purple-200 text-purple-900 border-purple-300',  // Beginning of Person
    'B-ORG': 'bg-yellow-200 text-yellow-900 border-yellow-300',  // Beginning of Organization
    'I-LOC': 'bg-lime-200 text-lime-900 border-lime-300',      // Inside Location
    'I-PER': 'bg-pink-200 text-pink-900 border-pink-300',        // Inside Person
    'I-ORG': 'bg-teal-200 text-teal-900 border-teal-300',      // Inside Organization
};

const entityDescriptions: Record<string, { en: string, ne: string }> = {
    'O': { en: 'Other', ne: 'अन्य' },
    'B-LOC': { en: 'Beginning of Location', ne: 'स्थानको सुरुवात' },
    'B-PER': { en: 'Beginning of Person', ne: 'व्यक्तिको सुरुवात' },
    'B-ORG': { en: 'Beginning of Organization', ne: 'संस्थाको सुरुवात' },
    'I-LOC': { en: 'Inside Location', ne: 'स्थानको अन्तर्गत' },
    'I-PER': { en: 'Inside Person', ne: 'व्यक्तिको अन्तर्गत' },
    'I-ORG': { en: 'Inside Organization', ne: 'संस्थाको अन्तर्गत' },
};

interface NamedEntityRecognitionProps {
    isNepaliUI: boolean;
}

const NamedEntityRecognition: React.FC<NamedEntityRecognitionProps> = ({ isNepaliUI }) => {
    const [text, setText] = useState('');
    const [entities, setEntities] = useState<Entity[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [processed, setProcessed] = useState(false);

    // Language text resources
    const languageText: { nepali: LanguageText, english: LanguageText } = {
        nepali: {
            title: "नामित इकाई पहिचान",
            description: "नेपाली पाठ प्रविष्ट गर्नुहोस् र हाम्रो मोडेलले व्यक्ति, संस्था, स्थान, मिति र अन्य जस्ता नामित इकाईहरू पहिचान र वर्गीकरण गर्नेछ।",
            inputLabel: "नेपाली पाठ प्रविष्ट गर्नुहोस्",
            placeholder: "रामले गएको हप्ता काठमाडौंमा भएको त्रिभुवन विश्वविद्यालयको कार्यक्रममा भाग लिए। यो कार्यक्रम २०७८ साल असार महिनामा आयोजना गरिएको थियो।",
            errorEmpty: "कृपया केही नेपाली पाठ प्रविष्ट गर्नुहोस्।",
            errorNotNepali: "कृपया नेपाली भाषामा मात्र लेख्नुहोस्।",
            errorFetchingEntities: "इकाईहरू प्राप्त गर्न त्रुटि भयो",
            buttonProcessing: "प्रशोधन गर्दै...",
            buttonIdentifyEntities: "इकाईहरू पहिचान गर्नुहोस्",
            identifiedEntities: "पहिचान गरिएका इकाईहरू",
            entityLegend: "इकाई सूची",
        },
        english: {
            title: "Named Entity Recognition",
            description: "Enter Nepali text and our model will identify and classify named entities such as people, organizations, locations, dates, and more.",
            inputLabel: "Enter Nepali text",
            placeholder: "रामले गएको हप्ता काठमाडौंमा भएको त्रिभुवन विश्वविद्यालयको कार्यक्रममा भाग लिए। यो कार्यक्रम २०७८ साल असार महिनामा आयोजना गरिएको थियो।",
            errorEmpty: "Please enter some Nepali text.",
            errorNotNepali: "Please enter text in Nepali language.",
            errorFetchingEntities: "Error fetching entities",
            buttonProcessing: "Processing...",
            buttonIdentifyEntities: "Identify Entities",
            identifiedEntities: "Identified Entities",
            entityLegend: "Entity Legend",
        }
    };

    // Get current language text
    const text_labels = isNepaliUI ? languageText.nepali : languageText.english;

    // Function to check if text is in Nepali
    const isNepaliText = (inputText: string): boolean => {
        // Check for Nepali Unicode range (0900-097F for Devanagari)
        const nepaliPattern = /^[\u0900-\u097F\s.,!?।-]+$/;
        
        // Remove spaces and common punctuation for the check
        const textToCheck = inputText.replace(/[\s.,!?।-]/g, '');
        
        // Text must contain at least one Nepali character
        return nepaliPattern.test(inputText) && textToCheck.length > 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!text) {
            setError(text_labels.errorEmpty);
            return;
        }

        if (!isNepaliText(text)) {
            setError(text_labels.errorNotNepali);
            setIsLoading(false);
            setProcessed(false);
            setEntities([]);
            return;
        }

        setIsLoading(true);
        setError('');
        setProcessed(false);

        try {
            const response = await axios.post('http://34.198.228.140:8000/ner', {
                text: text
            });


            if (Array.isArray(response.data)) {
                setEntities(response.data);
                setProcessed(true);
            } else {
                console.error('Response data is not in the expected format:', response.data);
                setError('Unexpected response format');
            }
        } catch (err: any) {
            setError(`${text_labels.errorFetchingEntities}: ${err.message}`);
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

            const description = isNepaliUI 
                ? entityDescriptions[entity.type]?.ne || entity.type 
                : entityDescriptions[entity.type]?.en || entity.type;

            parts.push(
                <span
                    key={`entity-${index}`}
                    className={`${entityColors[entity.type] || entityColors.O} px-1 py-0.5 rounded border relative group`}
                    title={description || 'Unknown Entity'} // Show description on hover
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

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{text_labels.title}</h2>
            <p className="text-gray-600 mb-6">
                {text_labels.description}
            </p>

            <form onSubmit={handleSubmit} className="mb-6">
                <div className="mb-4">
                    <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                        {text_labels.inputLabel}
                    </label>
                    <textarea
                        id="text"
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder={text_labels.placeholder}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        dir="auto"
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
                            {text_labels.buttonProcessing}
                        </>
                    ) : (
                        text_labels.buttonIdentifyEntities
                    )}
                </button>
            </form>

            {processed && (
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="text-lg font-medium text-gray-800 mb-3">{text_labels.identifiedEntities}</h3>
                        {renderProcessedText()}
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-3">{text_labels.entityLegend}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {Object.entries(entityDescriptions).map(([type, labels]) => (
                                <div key={type} className="flex items-center">
                                    <span className={`${entityColors[type] || entityColors.O} px-2 py-1 rounded text-xs font-medium border mr-2`}>
                                        {type}
                                    </span>
                                    <span className="text-sm text-gray-700">{isNepaliUI ? labels.ne : labels.en}</span>
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