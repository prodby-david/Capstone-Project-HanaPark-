import React from 'react'

const UserFooter = () => {
  return (
    <footer className="bg-white text-center text-color-2 text-sm md:text-md py-5 mt-3 w-full border-t border-gray-200">
      &copy; {new Date().getFullYear()} HanaPark. All rights reserved.
    </footer>
  )
}

export default UserFooter
