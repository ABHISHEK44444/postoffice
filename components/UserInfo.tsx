import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from './icons';

const UserInfo: React.FC = () => {
    return (
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 text-sm">
            {/* Welcome Part */}
            <div className="hidden md:block text-right">
                <p className="font-semibold text-gray-800">Welcome JOHN.SL</p>
                <p className="text-gray-500">Business Date: 16-10-2025</p>
            </div>
            
            {/* Office Part */}
            <div className="flex items-center gap-1">
                <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 shadow-sm max-w-xs">
                    <div className="leading-tight">
                        <p className="font-semibold text-gray-700">Current Office:</p>
                        <p className="text-gray-800 break-words">Jaipur Mo RMS TMO (22800001)</p>
                    </div>
                    <div className="mt-2 leading-tight">
                        <p className="font-semibold text-gray-700">Set Date and Name:</p>
                        <p className="text-gray-800">16-10-2025, SET1</p>
                    </div>
                </div>
                {/* Icons */}
                <div className="flex flex-col self-stretch justify-around">
                    <button className="p-1 rounded-full hover:bg-gray-200 transition-colors" aria-label="Search">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-1 rounded-full hover:bg-gray-200 transition-colors" aria-label="Filter">
                        <FunnelIcon className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
