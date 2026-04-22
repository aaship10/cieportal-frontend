import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import ThemeToggleButton from './ThemeToggleButton';
import { Link } from 'react-router-dom';

export default function Header() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <header className="bg-white border-b border-gray-200 dark:bg-dark-800 dark:border-gray-700 py-4 px-6 md:px-12 flex justify-between items-center shadow-md transition-colors duration-200">
        <h1 className="text-2xl font-bold text-primary-500 tracking-wider">
          <Link to="/">CIEPortal</Link>
        </h1>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <Link to="/profile" className="font-medium flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="hidden md:inline">{user.name}</span>
              </Link>
            </>
          )}
          <ThemeToggleButton />
        </div>
      </header>
    </>
  );
}
