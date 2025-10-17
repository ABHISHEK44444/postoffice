import React from 'react';
import { View } from '../App';
import { 
  ArrowLeftIcon,
  DocumentTextIcon,
  InboxArrowDownIcon,
  FolderOpenIcon,
  ArchiveBoxIcon,
  PlaneIcon
} from './icons';

type BaggingOperationViews = Extract<View, 'bag_despatch' | 'bag_receipt' | 'bag_close_at_mo'>;

interface OperationButtonProps {
  label: React.ReactNode;
  icon: React.ReactNode;
  onClick?: () => void;
}

const OperationButton: React.FC<OperationButtonProps> = ({ label, icon, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center w-full text-left p-3 bg-gray-200 rounded-full shadow-sm hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
  >
    <div className="mr-3 p-1 bg-white rounded-full flex-shrink-0">
      {icon}
    </div>
    <div className="text-gray-700 font-semibold text-sm leading-tight">
      {label}
    </div>
  </button>
);

// FIX: Replaced JSX.Element with React.ReactNode to resolve "Cannot find namespace 'JSX'" error and for consistency with other components.
const operationsList: { label: string; icon: React.ReactNode; navigateTo?: BaggingOperationViews }[] = [
  { label: "Fetch From Counter", icon: <DocumentTextIcon className="w-5 h-5 text-gray-600" /> },
  { label: "Bag Receive (F1)", icon: <InboxArrowDownIcon className="w-5 h-5 text-gray-600" />, navigateTo: 'bag_receipt' },
  { label: "Bag Open (F2)", icon: <FolderOpenIcon className="w-5 h-5 text-gray-600" /> },
  { label: "Bag Close At MO (F3)", icon: <ArchiveBoxIcon className="w-5 h-5 text-gray-600" />, navigateTo: 'bag_close_at_mo' },
  { label: "Bag Despatch (F4)", icon: <PlaneIcon className="w-5 h-5 text-gray-600" />, navigateTo: 'bag_despatch' },
];

const BaggingOperations: React.FC<{ onBack: () => void; onNavigate: (view: BaggingOperationViews) => void; }> = ({ onBack, onNavigate }) => {
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
          Bagging Operations
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
        {operationsList.map((op, index) => (
          <OperationButton 
            key={index} 
            label={op.label} 
            icon={op.icon}
            onClick={op.navigateTo ? () => onNavigate(op.navigateTo) : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default BaggingOperations;