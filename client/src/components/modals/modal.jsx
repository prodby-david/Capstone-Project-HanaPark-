import React from 'react'


const Modal = ({onOpen, onClose, title, message, actions}) => {
    
  return (
    <>
        <div>
            {onOpen && (
                <div>

                    <div>
                        <h2>{title}</h2>
                    </div>

                    <div>
                        <p>{message}</p>
                    </div>

                    <div>
                        <button>
                            Try Again
                        </button>
                    </div>

                </div>
            )}
        </div>
        
    </>
  )
}

export default Modal;
