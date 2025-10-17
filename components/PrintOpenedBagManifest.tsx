import React, { useState } from 'react';
import { HomeIcon, ChevronRightIcon, StarIcon } from './icons';
import UserInfo from './UserInfo';

const PrintOpenedBagManifest: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [bagNumber, setBagNumber] = useState('');

    return (
        <div className="relative z-10 animate-fade-in">
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <div className="flex-1">
                        <button className="flex items-center text-sm text-gray-600 hover:text-blue-600">
                            <StarIcon className="w-4 h-4 mr-2" />
                            Favourites (Ctrl+A)
                        </button>
                    </div>
                    <h2 className="flex-grow text-2xl font-bold text-gray-800 text-center whitespace-nowrap">Print Opened Bag Manifest</h2>
                    <div className="flex-1 flex justify-end">
                       <UserInfo />
                    </div>
                </div>
                <nav aria-label="Breadcrumb" className="text-sm mt-2">
                    <ol className="flex items-center space-x-2 text-gray-500">
                        <li>
                            <button onClick={onBack} className="hover:text-gray-700 flex items-center">
                                <HomeIcon className="w-4 h-4 mr-2" />
                                Home
                            </button>
                        </li>
                        <li><ChevronRightIcon className="w-4 h-4" /></li>
                        <li><span className="font-semibold text-gray-700">Print Opened Bag Manifest</span></li>
                    </ol>
                </nav>
            </div>
            
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 items-end max-w-md">
                    <div className="w-full">
                        <label htmlFor="bagNumber" className="block text-xs font-medium text-gray-500 mb-1">Bag Number</label>
                        <input 
                            type="text"
                            id="bagNumber"
                            value={bagNumber}
                            onChange={(e) => setBagNumber(e.target.value)}
                            className="form-input w-full px-3 py-2 border border-blue-400 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <button 
                        className="w-full sm:w-auto px-6 py-2 h-10 text-white font-semibold bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                        View
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrintOpenedBagManifest;