import React from 'react';

function Footer() {
  return (
    <footer className="p-6 mt-10 text-[#2C2C2C] bg-[#B9D4AA] shadow-inner dark:bg-[#2C2C2C] dark:text-[#B9D4AA]">
      <p className="mb-4 text-sm text-center">© 2025 Your Company Name. All rights reserved.</p>
      <p className="mb-2 text-center">Follow us on:</p>

      <ul className="flex justify-center mb-6 space-x-6">
        <li>
          <a href="https://github.com/aasmaa01" target="_blank" rel="noreferrer" className="hover:text-[#5A827E] dark:hover:text-[#84AE92]">GitHub</a>
        </li>
        <li>
          <a href="https://instagram.com/aasmaa__as" target="_blank" rel="noreferrer" className="hover:text-[#5A827E] dark:hover:text-[#84AE92]">Instagram</a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/aasmaa01/" target="_blank" rel="noreferrer" className="hover:text-[#5A827E] dark:hover:text-[#84AE92]">LinkedIn</a>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
