import React from "react";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-color text-white w-full py-5">
      
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-10 px-5">

        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="font-semibold text-lg text-white">About HanaPark</h2>
          <p className="max-w-[350px] mt-2 text-xs text-justify">
            HanaPark is a smart parking management solution designed to streamline parking systems, reduce stress, and helps you find the perfect spots every time.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="font-semibold text-lg text-white">Quick Links</h2>
          <ul className="mt-2 grid grid-cols-2 gap-x-5 gap-y-2 md:flex md:flex-col text-xs">
            <li><Link to='/sign-in' className="hover:text-color-3">Log in</Link></li>
            <li><Link to='/faq' className="hover:text-color-3">FAQ's</Link></li>
            <li><Link to='/terms-and-conditions' className="hover:text-color-3">Terms and Privacy</Link></li>
          </ul>
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left text-xs">
          <h2 className="font-semibold text-lg text-white mb-2">Contact</h2>
          <p>Email: support@hanapark.com</p>
          <p>Phone: +63 912 345 6789</p>
          <p>Location: Metro Manila, PH</p>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-10 flex justify-center">
        <div className="h-px w-full max-w-[1200px] bg-white"></div>
      </div>

      {/* Copyright */}
      <p className="text-center mt-5 text-sm">
        &copy; {new Date().getFullYear()} HanaPark. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
