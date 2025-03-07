import React, { useState } from 'react';
// import { Braces, FileText, MessageSquare } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import FillInTheBlank from './components/FillInTheBlank';
import NamedEntityRecognition from './components/NamedEntityRecognition';
import PartsOfSpeech from './components/PartsOfSpeech';

// Create a language text interface for all app-wide text content
interface AppLanguageText {
  fillBlankTab: string;
  fillBlankTabMobile: string;
  nerTab: string;
  nerTabMobile: string;
  posTab: string;
  posTabMobile: string;
  footerTitle: string;
  footerDescription: string;
  resourcesTitle: string;
  documentation: string;
  apiReference: string;
  githubRepo: string;
  contactTitle: string;
  contactDescription: string;
  allRightsReserved: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<'fill-blank' | 'ner' | 'pos'>('fill-blank');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNepaliUI, setIsNepaliUI] = useState(false); // Default to English UI

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleLanguage = () => {
    setIsNepaliUI(!isNepaliUI);
  };

  // Language text for app-wide content
  const languageText: { nepali: AppLanguageText, english: AppLanguageText } = {
    nepali: {
      fillBlankTab: 'रिक्त स्थान भर्नुहोस्',
      fillBlankTabMobile: 'रिक्त',
      nerTab: 'नामित इकाई पहिचान',
      nerTabMobile: 'NER',
      posTab: 'भाषाको भागहरू',
      posTabMobile: 'POS',
      footerTitle: 'शब्दमन्थन',
      footerDescription: 'प्राकृतिक भाषा प्रशोधन कार्यहरू बढाउन डिजाइन गरिएको अत्याधुनिक नेपाली भाषा एम्बेडिङ मोडेल।',
      resourcesTitle: 'स्रोतहरू',
      documentation: 'प्रलेखन',
      apiReference: 'API सन्दर्भ',
      githubRepo: 'GitHub रिपोजिटरी',
      contactTitle: 'सम्पर्क',
      contactDescription: 'प्रश्न वा प्रतिक्रिया छ? हाम्रो टोलीलाई सम्पर्क गर्नुहोस्।',
      allRightsReserved: 'सर्वाधिकार सुरक्षित।'
    },
    english: {
      fillBlankTab: 'Fill in the Blank',
      fillBlankTabMobile: 'Fill Blank',
      nerTab: 'Named Entity Recognition',
      nerTabMobile: 'NER',
      posTab: 'Parts of Speech',
      posTabMobile: 'POS',
      footerTitle: 'Sabdamanthan',
      footerDescription: 'A state-of-the-art Nepali language embedding model designed to enhance natural language processing tasks.',
      resourcesTitle: 'Resources',
      documentation: 'Documentation',
      apiReference: 'API Reference',
      githubRepo: 'GitHub Repository',
      contactTitle: 'Contact',
      contactDescription: 'Have questions or feedback? Reach out to our team.',
      allRightsReserved: 'All rights reserved.'
    }
  };

  // Get current language text
  const text = isNepaliUI ? languageText.nepali : languageText.english;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Fixed header with z-index */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Header 
          toggleMobileMenu={toggleMobileMenu} 
          mobileMenuOpen={mobileMenuOpen} 
          isNepaliUI={isNepaliUI}
          toggleLanguage={toggleLanguage}
        />
      </div>
      
      <main className="pt-0">
        <Hero isNepaliUI={isNepaliUI} />
        
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('fill-blank')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm sm:text-base flex items-center justify-center ${
                    activeTab === 'fill-blank'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {/* <MessageSquare className="w-5 h-5 mr-2" /> */}
                  <span className="hidden sm:inline">{text.fillBlankTab}</span>
                  <span className="sm:hidden">{text.fillBlankTabMobile}</span>
                </button>
                <button
                  onClick={() => setActiveTab('ner')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm sm:text-base flex items-center justify-center ${
                    activeTab === 'ner'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {/* <FileText className="w-5 h-5 mr-2" /> */}
                  <span className="hidden sm:inline">{text.nerTab}</span>
                  <span className="sm:hidden">{text.nerTabMobile}</span>
                </button>
                <button
                  onClick={() => setActiveTab('pos')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm sm:text-base flex items-center justify-center ${
                    activeTab === 'pos'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {/* <Braces className="w-5 h-5 mr-2" /> */}
                  <span className="hidden sm:inline">{text.posTab}</span>
                  <span className="sm:hidden">{text.posTabMobile}</span>
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'fill-blank' && <FillInTheBlank isNepaliUI={isNepaliUI} />}
              {activeTab === 'ner' && <NamedEntityRecognition isNepaliUI={isNepaliUI} />}
              {activeTab === 'pos' && <PartsOfSpeech isNepaliUI={isNepaliUI} />}
            </div>
          </div>  
        </section>
      </main>
      
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{text.footerTitle}</h3>
              <p className="text-gray-300">
                {text.footerDescription}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{text.resourcesTitle}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">{text.documentation}</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">{text.apiReference}</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">{text.githubRepo}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{text.contactTitle}</h3>
              <p className="text-gray-300">
                {text.contactDescription}
              </p>

              <a href="mailto:manishpyakurel67@gmail.com" className="mt-2 block text-indigo-400 hover:text-indigo-300">
                Manish Pyakurel
              </a>
              <a href="mailto:neupanerupak7@gmail.com" className="mt-2 block text-indigo-400 hover:text-indigo-300">
                Rupak Neupane
              </a>
              <a href="mailto:sarjyant@gmail.com" className="mt-2 block text-indigo-400 hover:text-indigo-300">
                Sarjyant Shrestha
              </a>
              <a href="mailto:srijangyawali0@gmail.com" className="mt-2 block text-indigo-400 hover:text-indigo-300">
                Srijan Gyawali
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Sabdamanthan. {text.allRightsReserved}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;