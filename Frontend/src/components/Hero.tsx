import React from 'react';

interface HeroProps {
  isNepaliUI: boolean;
}

const Hero: React.FC<HeroProps> = ({ isNepaliUI }) => {
  return (
    <div className="relative bg-indigo-800 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-8">
          <div className="pt-10 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div>
                <div className="sm:text-center lg:text-left">
                  <h1>
                    <span className="block text-sm font-semibold uppercase tracking-wide text-gray-300 sm:text-base lg:text-sm xl:text-base">
                      {isNepaliUI ? 'परिचय' : 'Introducing'}
                    </span>
                    <span className="mt-1 block text-4xl tracking-tight font-extrabold text-white sm:text-5xl xl:text-6xl">
                      <span className="block"> शब्दमन्थन</span>
                      <span className="block text-indigo-400">Sabdamanthan</span>
                    </span>
                  </h1>
                  <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl text-left">
                    {isNepaliUI 
                      ? 'नेपाली पाठको प्राकृतिक भाषा प्रशोधनलाई क्रान्तिकारी बनाउन डिजाइन गरिएको शक्तिशाली नेपाली भाषा एम्बेडिङ मोडेल। विभिन्न एनएलपी कार्यहरूमा अत्याधुनिक प्रदर्शन अनुभव गर्नुहोस्।'
                      : 'A powerful Nepali language embedding model designed to revolutionize natural language processing for Nepali text. Experience state-of-the-art performance in various NLP tasks.'}
                  </p>
                  <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                    <a
                      href="#"
                      className="ml-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {isNepaliUI ? 'थप जानकारी' : 'Learn More'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;