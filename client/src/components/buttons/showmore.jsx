import React from 'react'

const ShowMore = ({ onClick }) => {
  return (
    <div>
      <button
         className="text-sm w-xs bg-color-3 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition"
         onClick={ onClick }
        >
          See More
        </button>
    </div>
  )
}

export default React.memo(ShowMore);
