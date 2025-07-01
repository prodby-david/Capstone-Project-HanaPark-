import React from 'react'

const UserFooter = () => {
  return (
   <>
    <p className="bg-white p-5 text-center mt-28 text-color-2 text-sm md:text-md">
        &copy; {new Date().getFullYear()} HanaPark. All rights reserved.
    </p>
   </>
        

  )
}

export default UserFooter;
