
import React from 'react';

const VerifiedIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm3.123 5.467a.75.75 0 00-1.06 1.06l1.25 1.25a.75.75 0 001.06 0l2.5-2.5a.75.75 0 00-1.06-1.06L9.39 9.22l-.722-.722z" clipRule="evenodd" />
  </svg>
);

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl">
      <div className="w-full aspect-video bg-white/30 backdrop-blur-sm rounded-xl mb-6 overflow-hidden shadow-lg border border-white/20">
        <img
          src="https://i.imgur.com/3tq8TU6.jpeg"
          alt="Channel Banner"
          className="w-full h-full object-cover"
        />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center space-x-2">
        <span>@kemchannelpg</span>
        <VerifiedIcon />
      </h1>
      <p className="text-gray-600">Your direct line to our expert team.</p>
    </header>
  );
};

export default Header;
