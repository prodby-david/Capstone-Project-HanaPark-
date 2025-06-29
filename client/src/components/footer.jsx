import React from "react";
import { Link } from 'react-router-dom';


const Footer = () => {

    return(

        <div className="bg-color text-white h-full w-full pb-6">

            <div className="flex flex-col md:flex-row justify-around items-center p-5 gap-y-10">

                <div className="flex flex-col items-center md:items-start">

                    <h2 className="font-semibold text-lg">About HanaPark</h2>

                    <p className="max-w-[350px] text-xs text-color-2 mt-1 text-justify">HanaPark is a smart parking management solution designed to streamline parking systems, reduce stress, and helps you find the perfect spots every time.</p>

                </div>

                <div className="flex flex-col">

                    <h2 className="font-semibold text-lg text-center">Quick Links</h2>

                    <ul className="grid grid-cols-2 gap-x-10 md:flex md:flex-col lg:block list-disc list-inside text-xs mt-2">

                        <li>
                            <Link to='/sign-in' className="hover:text-color-3 text-color-2">Log in</Link>
                        </li>

                        <li>
                            <Link to='/faqs' className="hover:text-color-3 text-color-2">FAQ's</Link>
                        </li>

                        <li>
                            <Link to='terms-and-conditions' className="hover:text-color-3 text-color-2">Terms and Privacy</Link>
                        </li>

                    </ul>

                </div>

                <div className="text-xs">
                    <h2 className="font-semibold text-lg text-center">Contact</h2>

                    <p className="text-color-2">Email: support@hanapark.com</p>

                    <p className="text-color-2">Phone: +63 912 345 6789</p>
                    
                    <p className="text-color-2">Location: Metro Manila, PH</p>
                </div>

            </div>

             <div className="flex justify-center">
                <div className="h-px w-4xl mt-3 bg-color-2"></div>
            </div>

            <p className="text-center mt-7 text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} HanaPark. All rights reserved.
            </p>

       </div>
       
)
}

export default Footer;