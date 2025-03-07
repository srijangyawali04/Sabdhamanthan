import React from 'react';
// import { Menu, X } from 'lucide-react';

interface HeaderProps {
  toggleMobileMenu: () => void;
  mobileMenuOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-4xl font-bold text-indigo-600"> शब्दमन्थन</span>
              <span className="ml-3 text-2xl font-semibold  text-gray-600">Sabdamanthan</span>
            </div>
          </div>
          
          {/* <div className="md:hidden flex items-center">
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
    </header>
  );
};

export default Header;