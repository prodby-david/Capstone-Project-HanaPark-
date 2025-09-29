import React from 'react'

const SaveChanges = ({onClick}) => {
  return (
    <div>
      <button 
      onClick={onClick}
      type='submit'
      className='w-full bg-color-3 mt-5 p-2 text-white rounded-sm text-sm cursor-pointer hover:opacity-90'>
        Save Changes
      </button>
    </div>
  )
}

export default SaveChanges;
