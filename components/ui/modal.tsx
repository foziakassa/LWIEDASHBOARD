// components/ui/modal.tsx
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded shadow-lg p-4 w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500">
            &times; {/* Close button */}
          </button>
        </div>
        <div>{children}</div>
        <div className="mt-4 flex justify-end">
          <button 
            onClick={onClose} 
            className="bg-gray-200 hover:bg-gray-300 rounded px-4 py-2 mr-2"
          >
            Cancel
          </button>
          <button 
            onClick={() => { 
              // Add additional logic if needed
              onClose(); 
            }} 
            className="bg-blue-500 text-white rounded px-4 py-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};