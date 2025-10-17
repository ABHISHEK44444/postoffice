import React from 'react';
import { ReportViews } from '../App';
import { 
  ArrowLeftIcon,
  PrinterIcon
} from './icons';

interface ReportButtonProps {
  label: React.ReactNode;
  icon: React.ReactNode;
  onClick?: () => void;
}

const ReportButton: React.FC<ReportButtonProps> = ({ label, icon, onClick }) => (
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

const reportsList: { label: string; icon: React.ReactNode; navigateTo?: ReportViews }[] = [
  { label: "Print Bag Manifest", icon: <PrinterIcon className="w-5 h-5 text-gray-600" />, navigateTo: 'print_opened_bag_manifest' },
  { label: "Re Print Mail List", icon: <PrinterIcon className="w-5 h-5 text-gray-600" /> },
  { label: "Bulk Del Bag Out for Delivery Slip", icon: <PrinterIcon className="w-5 h-5 text-gray-600" /> },
  { label: "Bag Label Print", icon: <PrinterIcon className="w-5 h-5 text-gray-600" /> },
  { label: "Departure Slip", icon: <PrinterIcon className="w-5 h-5 text-gray-600" /> },
];

const BagReports: React.FC<{ onBack: () => void; onNavigate: (view: ReportViews) => void; }> = ({ onBack, onNavigate }) => {
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
          Bag Reports
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
        {reportsList.map((report, index) => (
          <ReportButton 
            key={index} 
            label={report.label} 
            icon={report.icon}
            onClick={report.navigateTo ? () => onNavigate(report.navigateTo) : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default BagReports;