import React from 'react';
// import { Menu, X, Globe } from 'lucide-react';

interface HeaderProps {
  toggleMobileMenu: () => void;
  mobileMenuOpen: boolean;
  isNepaliUI: boolean;
  toggleLanguage: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileMenu, mobileMenuOpen, isNepaliUI, toggleLanguage }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-4xl font-bold text-indigo-600"> शब्दमन्थन</span>
              <span className="ml-3 text-2xl font-semibold text-gray-600">Sabdamanthan</span>
            </div>
          </div>
          
          {/* Language toggle in header */}
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <span className={`mr-2 text-sm ${!isNepaliUI ? 'font-medium' : 'text-gray-500'}`}>
                English
              </span>
              <div 
                onClick={toggleLanguage}
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                style={{ backgroundColor: isNepaliUI ? '#4F46E5' : '#D1D5DB' }}
              >
                <span className="sr-only">Toggle Language</span>
                <span 
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isNepaliUI ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
              <span className={`ml-2 text-sm ${isNepaliUI ? 'font-medium' : 'text-gray-500'}`}>
                नेपाली
              </span>
            </div>

            {/* Mobile menu button - commented out as in your original code */}
            {/* <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {mobileMenuOpen ? (
                  // <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  // <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;