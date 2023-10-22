import React from "react";

interface ModalProps {
  isOpen: boolean;
  handleClick: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, handleClick, children }) => {
  return (
    <div>
      {isOpen && (
        <>
          <div
            className="absolute top-0 left-0 w-full h-full bg-black opacity-50"
            onClick={handleClick}
          ></div>
          
          <div className="fixed top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] flex items-center justify-center z-50">
            <div className="bg-white flex justify-center items-center  px-8 py-2 rounded-2xl shadow-lg z-100 relative">
              
                {children}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Modal;
