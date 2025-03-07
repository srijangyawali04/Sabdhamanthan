import React, { useState } from 'react';
// import { Braces, FileText, MessageSquare } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import FillInTheBlank from './components/FillInTheBlank';
import NamedEntityRecognition from './components/NamedEntityRecognition';
import PartsOfSpeech from './components/PartsOfSpeech';

function App() {
  const [activeTab, setActiveTab] = useState<'fill-blank' | 'ner' | 'pos'>('fill-blank');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Fixed header with z-index */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Header toggleMobileMenu={toggleMobileMenu} mobileMenuOpen={mobileMenuOpen} />
      </div>
      
      <main className="pt-0"> {/* You may need to adjust this padding based on your header height */}
        <Hero />
        
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
                  <span className="hidden sm:inline">Fill in the Blank</span>
                  <span className="sm:hidden">Fill Blank</span>
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
                  <span className="hidden sm:inline">Named Entity Recognition</span>
                  <span className="sm:hidden">NER</span>
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
                  <span className="hidden sm:inline">Parts of Speech</span>
                  <span className="sm:hidden">POS</span>
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'fill-blank' && <FillInTheBlank />}
              {activeTab === 'ner' && <NamedEntityRecognition />}
              {activeTab === 'pos' && <PartsOfSpeech />}
            </div>
          </div>  
        </section>
      </main>
      
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Sabdamanthan</h3>
              <p className="text-gray-300">
                A state-of-the-art Nepali language embedding model designed to enhance natural language processing tasks.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">API Reference</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">GitHub Repository</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-300">
                Have questions or feedback? Reach out to our team.
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
            <p>© {new Date().getFullYear()} Sabdamanthan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
