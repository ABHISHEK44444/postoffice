import React, { useState } from 'react';
import Header from './components/Header';
import InfoBar from './components/InfoBar';
import ManagementButton from './components/ManagementButton';
import BagOperationTools from './components/BaggingTools';
import BaggingOperations from './components/BaggingOperations';
import BagReports from './components/BagReports';
import BagDespatch from './components/BagDespatch';
import BagReceipt from './components/BagReceipt';
import BagCloseAtMO from './components/BagCloseAtMO';
import PrintOpenedBagManifest from './components/PrintOpenedBagManifest';
import Login from './components/Login';
import { 
  BagIcon, 
  SupervisorIcon, 
  BulkDeliveryIcon, 
  ReportsIcon, 
  ToolsIcon, 
  PnopIcon,
  ChevronRightIcon
} from './components/icons';

const operations = [
  {
    id: 'bagging_operation',
    title: 'Bagging Operation',
    subtitle: 'Receive, Open, Close, Despatch',
    icon: <BagIcon className="w-10 h-10 text-blue-100" />,
    color: 'bg-blue-600',
  },
  {
    id: 'supervisor',
    title: 'Supervisor',
    subtitle: 'INS Verification, ER Issue',
    icon: <SupervisorIcon className="w-10 h-10 text-red-100" />,
    color: 'bg-red-600',
  },
  {
    id: 'bulk_dely_bag',
    title: 'Bulk Dely Bag',
    subtitle: 'Bulk Addressee Delivery',
    icon: <BulkDeliveryIcon className="w-10 h-10 text-orange-100" />,
    color: 'bg-orange-600',
  },
  {
    id: 'bag_reports',
    title: 'Bag Reports',
    subtitle: 'Bag Manifest, Mail List',
    icon: <ReportsIcon className="w-10 h-10 text-purple-100" />,
    color: 'bg-purple-600',
  },
  {
    id: 'tools',
    title: 'Tools',
    subtitle: 'Bag Operation Tools',
    icon: <ToolsIcon className="w-10 h-10 text-teal-100" />,
    color: 'bg-teal-500',
  },
  {
    id: 'pnop',
    title: 'PNOP',
    subtitle: 'Primary Scan, Secondary Scan',
    icon: <PnopIcon className="w-10 h-10 text-yellow-500" />,
    color: 'bg-yellow-400',
  },
];

const BackgroundWatermark: React.FC = () => (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="stamp" patternUnits="userSpaceOnUse" width="400" height="400" patternTransform="rotate(15)">
                     <text x="50" y="200" fontFamily="serif" fontSize="40" fill="rgba(0, 0, 0, 0.04)" transform="rotate(-15)">INDIA POST</text>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stamp)" />
        </svg>
    </div>
);

export type ReportViews = 'print_opened_bag_manifest';
export type View = 'main' | 'bag_operation_tools' | 'bagging_operations' | 'bag_reports' | 'bag_despatch' | 'bag_receipt' | 'bag_close_at_mo' | ReportViews;

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>('main');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleManagementClick = (id: string) => {
    if (id === 'tools') {
      setCurrentView('bag_operation_tools');
    } else if (id === 'bagging_operation') {
      setCurrentView('bagging_operations');
    } else if (id === 'bag_reports') {
      setCurrentView('bag_reports');
    }
     else {
      // Placeholder for other button clicks
      console.log(`Clicked ${id}`);
    }
  };
  
  const renderView = () => {
    switch (currentView) {
      case 'bag_operation_tools':
        return <BagOperationTools onBack={() => setCurrentView('main')} />;
      case 'bagging_operations':
        return <BaggingOperations onBack={() => setCurrentView('main')} onNavigate={(view) => setCurrentView(view)} />;
      case 'bag_reports':
        return <BagReports onBack={() => setCurrentView('main')} onNavigate={(view) => setCurrentView(view)} />;
      case 'bag_despatch':
        return <BagDespatch onBack={() => setCurrentView('bagging_operations')} />;
      case 'bag_receipt':
        return <BagReceipt onBack={() => setCurrentView('bagging_operations')} />;
      case 'bag_close_at_mo':
        return <BagCloseAtMO onBack={() => setCurrentView('bagging_operations')} />;
      case 'print_opened_bag_manifest':
        return <PrintOpenedBagManifest onBack={() => setCurrentView('bag_reports')} />;
      case 'main':
      default:
        return (
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b-2 border-gray-200 pb-2">
              Bagging Management
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {operations.map((op) => (
                <ManagementButton
                  key={op.id}
                  title={op.title}
                  subtitle={op.subtitle}
                  icon={op.icon}
                  color={op.color}
                  onClick={() => handleManagementClick(op.id)}
                />
              ))}
            </div>

            <div className="flex justify-between items-center mt-8 text-sm text-gray-600">
              <p>Page 1 of 2</p>
              <div className="flex items-center space-x-4">
                 <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
                  <span className="sr-only">Next Page</span>
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
                <span className="text-gray-500">Version 2025.09.0</span>
              </div>
            </div>
          </div>
        );
    }
  }
  
  if (!isAuthenticated) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <main className="container mx-auto px-4 py-8 relative">
                 <BackgroundWatermark />
                 <Login onLogin={handleLogin} />
            </main>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <InfoBar />

      <main className="container mx-auto px-4 py-8 relative">
        <BackgroundWatermark />
        {renderView()}
      </main>
    </div>
  );
};

export default App;