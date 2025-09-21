import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 px-4 mt-12">
      <div className="container mx-auto flex flex-col items-center justify-between space-y-4 md:space-y-0 md:flex-row">
        {/* Copyright and Brand */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold text-gray-200">GameHub</h3>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Foki Dogus. All Rights Reserved.
          </p>
        </div>

        {/* Social Media Links */}
        <div className="flex space-x-4">
          <a
            href="https://github.com/FokiDogus"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="GitHub Profile"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/FokiDogus"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}
