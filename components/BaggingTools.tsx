import React from 'react';
import { 
  DocumentTextIcon, 
  PencilIcon,
  TrashIcon,
  PlaneIcon,
  KeyIcon,
  BuildingLibraryIcon,
  ArrowLeftIcon
} from './icons';

interface ToolButtonProps {
  label: React.ReactNode;
  icon: React.ReactNode;
}

const ToolButton: React.FC<ToolButtonProps> = ({ label, icon }) => (
  <button className="flex items-center w-full text-left p-3 bg-gray-200 rounded-full shadow-sm hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
    <div className="mr-3 p-1 bg-white rounded-full flex-shrink-0">
      {icon}
    </div>
    <div className="text-gray-700 font-semibold text-sm leading-tight">
      {label}
    </div>
  </button>
);

const operationsList = [
  { label: <>Modify Opened Bag<br/>Content</>, icon: <DocumentTextIcon className="w-5 h-5 text-gray-600" /> },
  { label: <>Change Receive Bag<br/>Status For Bag Open</>, icon: <PencilIcon className="w-5 h-5 text-gray-600" /> },
  { label: <>Change Closed Bag<br/>Destination</>, icon: <PencilIcon className="w-5 h-5 text-gray-600" /> },
  { label: <>Bag Deletion</>, icon: <TrashIcon className="w-5 h-5 text-gray-600" /> },
  { label: <>Cancel Bag Despatch</>, icon: <PlaneIcon className="w-5 h-5 text-gray-600" /> },
  { label: <>Deposit Bag Close</>, icon: <BuildingLibraryIcon className="w-5 h-5 text-gray-600" /> },
  { label: <>Re-Open Closed Bag</>, icon: <KeyIcon className="w-5 h-5 text-gray-600" /> },
  { label: <>Change Pin Code</>, icon: <PencilIcon className="w-5 h-5 text-gray-600" /> },
];

const BagOperationTools: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="relative z-10 animate-fade-in">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack} 
          className="p-2 rounded-full hover:bg-gray-200 transition-colors mr-4"
          aria-label="Go back to Bagging Management"
        >
          <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
        </button>
        <h2 className="text-xl font-bold text-gray-700">
          Bag Operation Tools
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {operationsList.map((op, index) => (
          <ToolButton key={index} label={op.label} icon={op.icon} />
        ))}
      </div>
    </div>
  );
};

export default BagOperationTools;