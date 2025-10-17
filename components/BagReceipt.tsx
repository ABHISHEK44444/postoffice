import React, { useState, useRef, useEffect, useMemo } from 'react';
import { StarIcon, ChevronRightIcon, HomeIcon, ScaleIcon, ExclamationTriangleIcon, InformationCircleIcon, QrCodeIcon, ClipboardDocumentListIcon } from './icons';
import UserInfo from './UserInfo';

// Data reused from BagDespatch for consistency
const scheduleData = [
  { id: "100001", description: "Jaipur RMS/TMO-1 RMS/L/1 18:00, RTN Schedule" },
  { id: "100002", description: "Jaipur City/Jaipur-TMO Beawar (MSL)/L/1 18:00, RTN Schedule" },
  { id: "100003", description: "Jaipur City/Jaipur-TMO Deoli (Tonk) 19:00, RTN Schedule" },
  { id: "240016", description: "Bikaner RMS L2U/Jaipur Ma RMS TMO_05/30" },
  { id: "100005", description: "Jaipur City/Jaipur-Phalodi SO(Jodhpur) 20:15, RTN Schedule" },
  { id: "100006", description: "Jaipur City/Jaipur-TMO Ajmer(L) RMS/L/1L 21:00, RTN Schedule" },
];

const initialScannedBags = [
    { id: 'FBX0003515446', scheduleName: 'Bikaner RMS...', bagNumber: 'FBX0003515446', weight: 0.961, receiveType: 'Receiver', receivedFrom: 'BIKANER ICH' }
];

const expectedBagsData = [
    { id: 'EBM0039913559', bagNumber: 'EBM0039913559', despatchedBy: 'Vashi BPC', closedFromOffice: 'Pratap Nagar S...', closedToOffice: 'JODHPUR...', dateOfDespatch: '09-10-2025 03:42'},
    { id: 'CBB0007212769', bagNumber: 'CBB0007212769', despatchedBy: 'Patna RMS Air', closedFromOffice: 'Kolkata NSH', closedToOffice: 'JODHPUR...', dateOfDespatch: '09-10-2025 08:02'},
    { id: 'EBF0094455466', bagNumber: 'EBF0094455466', despatchedBy: 'Patna RMS Air', closedFromOffice: 'Pratap Nagar S...', closedToOffice: 'Jaipur N...', dateOfDespatch: '09-10-2025 09:25'},
    { id: 'EBY4045800029', bagNumber: 'EBY4045800029', despatchedBy: 'KOL AP TMO', closedFromOffice: 'Kolkata NSH', closedToOffice: 'Jaipur N...', dateOfDespatch: '09-10-2025 09:25'},
    { id: 'CBW0017578111', bagNumber: 'CBW0017578111', despatchedBy: 'KOL AP TMO', closedFromOffice: 'Kolkata NSH', closedToOffice: 'JODHPUR...', dateOfDespatch: '09-10-2025 09:25'},
    { id: 'EBX0003229931', bagNumber: 'EBX0003229931', despatchedBy: 'Pratap Nagar S...', closedFromOffice: 'Pratap Nagar S...', closedToOffice: 'JODHPUR...', dateOfDespatch: '09-10-2025 09:25'},
];

const Notification: React.FC<{ type: 'warning' | 'info', title: string, children: React.ReactNode }> = ({ type, title, children }) => {
    const isWarning = type === 'warning';
    const bgColor = isWarning ? 'bg-yellow-100 border-yellow-400' : 'bg-blue-100 border-blue-400';
    const textColor = isWarning ? 'text-yellow-800' : 'text-blue-800';
    const iconColor = isWarning ? 'text-yellow-500' : 'text-blue-500';
    const Icon = isWarning ? ExclamationTriangleIcon : InformationCircleIcon;

    return (
        <div className={`p-3 rounded-md border ${bgColor} ${textColor}`}>
            <div className="flex items-start">
                <div className={`flex-shrink-0 ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="ml-3 text-sm">
                    <p className="font-semibold">{title}</p>
                    <div className="mt-1">{children}</div>
                </div>
            </div>
        </div>
    );
};

const BagReceipt: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [isFetched, setIsFetched] = useState(false);
    const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
    const [mailListId, setMailListId] = useState('');
    const [arrivalId, setArrivalId] = useState('');
    
    // State for receipt view
    const [scannedBags, setScannedBags] = useState(initialScannedBags);
    const [bagNumberInput, setBagNumberInput] = useState('');
    const [bagWeightInput, setBagWeightInput] = useState('');

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownRef]);
    
    const handleFetch = () => {
        if(selectedScheduleId) setIsFetched(true);
    };

    const handleBack = () => {
        if(isFetched) setIsFetched(false);
        else onBack();
    }
    
    const handleAddBag = (e: React.FormEvent) => {
        e.preventDefault();
        if(!bagNumberInput || !bagWeightInput) return;
        
        const newBag = {
            id: bagNumberInput,
            scheduleName: scheduleData.find(s => s.id === selectedScheduleId)?.description.split(' ')[0] || 'New Schedule',
            bagNumber: bagNumberInput,
            weight: parseFloat(bagWeightInput),
            receiveType: 'Receiver',
            receivedFrom: 'BIKANER ICH'
        };
        setScannedBags(prev => [newBag, ...prev]);
        setBagNumberInput('');
        setBagWeightInput('');
    }

    const filteredScannedBags = useMemo(() => {
        return scannedBags.filter(bag => {
            const bagId = bag.bagNumber || '';
            const bagWeight = bag.weight?.toString() || '';
            const matchesNumber = bagId.toLowerCase().includes(bagNumberInput.toLowerCase());
            const matchesWeight = bagWeightInput ? bagWeight.includes(bagWeightInput) : true;
            return matchesNumber && matchesWeight;
        });
    }, [scannedBags, bagNumberInput, bagWeightInput]);

    const filteredExpectedBags = useMemo(() => {
        return expectedBagsData.filter(bag => {
            const bagId = bag.bagNumber || '';
            const matchesNumber = bagId.toLowerCase().includes(bagNumberInput.toLowerCase());
            // Expected bags don't have weight, so we only filter by number
            return matchesNumber;
        });
    }, [expectedBagsData, bagNumberInput]);


    const renderSelectionView = () => {
        const recentlyUsed = ["Sikar RMS L2U", "BIKANER RMS L2U"];
        const selectedSchedule = scheduleData.find(item => item.id === selectedScheduleId);
        const displayValue = selectedSchedule ? `${selectedSchedule.id} - ${selectedSchedule.description}` : 'Select a schedule...';

        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-grow">
                         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div className="md:col-span-2 relative" ref={dropdownRef}>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Select Schedule</label>
                                <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="form-input w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 flex justify-between items-center text-left">
                                    <span className="truncate">{displayValue}</span>
                                    <ChevronRightIcon className={`w-5 h-5 text-gray-400 transition-transform transform ${isDropdownOpen ? 'rotate-90' : ''}`} />
                                </button>
                                {isDropdownOpen && (
                                    <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                        {scheduleData.map(item => (
                                            <li key={item.id} onClick={() => { setSelectedScheduleId(item.id); setIsDropdownOpen(false); }} className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${selectedScheduleId === item.id ? 'bg-blue-600 text-white' : 'text-gray-900 hover:bg-gray-100'}`}>
                                                <span className="block whitespace-normal">{item.id} - {item.description}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div>
                               <label className="block text-xs font-medium text-gray-500 mb-1">Mail List ID</label>
                               <input type="text" value={mailListId} onChange={(e) => setMailListId(e.target.value)} className="form-input w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                            </div>
                             <div>
                               <label className="block text-xs font-medium text-gray-500 mb-1">Arrival ID</label>
                               <input type="text" value={arrivalId} onChange={(e) => setArrivalId(e.target.value)} className="form-input w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                            </div>
                            <button onClick={handleFetch} disabled={!selectedScheduleId} className="px-6 py-2 h-10 text-white font-semibold bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                Fetch
                            </button>
                        </div>
                    </div>
                    <div className="flex-shrink-0 w-full md:w-64">
                        <div className="bg-gray-800 text-white p-4 rounded-lg h-full">
                            <h4 className="font-semibold mb-3 border-b border-gray-600 pb-2">Recently Used</h4>
                            <ul className="space-y-2">
                                {recentlyUsed.map(item => (
                                    <li key={item} className="flex items-center">
                                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-3"></span>
                                        <span className="text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <a href="#" className="text-blue-400 hover:underline text-sm mt-4 inline-block">+ more</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    const renderReceiptView = () => {
        const selectedSchedule = scheduleData.find(s => s.id === selectedScheduleId);
        return(
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
                {/* Top Section */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end pb-4 border-b">
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Select Schedule</label>
                        <p className="form-input w-full px-3 py-2 bg-gray-100 border-gray-300 rounded-md text-sm truncate" title={selectedSchedule?.description}>{selectedSchedule?.description}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Mail List ID</label>
                        <input type="text" value={mailListId} onChange={(e) => setMailListId(e.target.value)} className="form-input w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Arrival ID</label>
                        <input type="text" value={arrivalId} onChange={(e) => setArrivalId(e.target.value)} className="form-input w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                    </div>
                </div>
                 {/* Scan Section */}
                 <form onSubmit={handleAddBag} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end pb-4 border-b">
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Bag Number</label>
                        <input type="text" value={bagNumberInput} onChange={e => setBagNumberInput(e.target.value)} placeholder="Scan, type bag number to search or add" className="form-input w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                    </div>
                    <div className="flex items-end gap-2">
                        <div className="flex-grow">
                           <label className="block text-xs font-medium text-gray-500 mb-1">Bag Weight(Kgs)</label>
                           <input type="number" step="0.01" value={bagWeightInput} onChange={e => setBagWeightInput(e.target.value)} className="form-input w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                        </div>
                        <button type="button" className="p-2 h-10 border border-gray-300 rounded-md hover:bg-gray-100"><ScaleIcon className="w-5 h-5 text-gray-600" /></button>
                    </div>
                     <button type="submit" className="px-6 py-2 h-10 text-white font-semibold bg-red-600 rounded-md hover:bg-red-700">Add</button>
                </form>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left & Middle Column */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Controls */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4 text-sm">
                                <label className="flex items-center"><input type="checkbox" className="form-checkbox h-4 w-4 mr-2" />Bulk Forward</label>
                                <label className="flex items-center"><input type="checkbox" className="form-checkbox h-4 w-4 mr-2" />Bulk Open</label>
                            </div>
                            <div className="font-semibold">Scan Count: {scannedBags.length}</div>
                        </div>

                        {/* Tables */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {/* Scanned Bags */}
                             <div className="space-y-2">
                                <h3 className="font-bold text-gray-700 flex items-center"><QrCodeIcon className="w-5 h-5 mr-2" /> Scanned Bags</h3>
                                <div className="border rounded-md overflow-x-auto">
                                    <div style={{ minWidth: '700px' }}>
                                        <table className="w-full text-xs">
                                            <thead className="bg-gray-100 text-gray-600 uppercase">
                                                <tr>
                                                    <th className="p-2 text-left whitespace-nowrap">ScheduleName</th>
                                                    <th className="p-2 text-left whitespace-nowrap">Bag Number</th>
                                                    <th className="p-2 text-left whitespace-nowrap">Weight</th>
                                                    <th className="p-2 text-left whitespace-nowrap">Receive Type</th>
                                                    <th className="p-2 text-left whitespace-nowrap">Received From</th>
                                                </tr>
                                            </thead>
                                        </table>
                                        <div className="h-48 overflow-y-auto">
                                            <table className="w-full text-xs">
                                                <tbody className="bg-white divide-y">
                                                    {filteredScannedBags.length > 0 ? filteredScannedBags.map(bag => (
                                                        <tr key={bag.id}>
                                                            <td className="p-2 truncate w-1/5">{bag.scheduleName}</td>
                                                            <td className="p-2 truncate w-1/5">{bag.bagNumber}</td>
                                                            <td className="p-2 w-[15%]">{bag.weight.toFixed(3)}</td>
                                                            <td className="p-2 w-1/5">
                                                                <select defaultValue={bag.receiveType} className="form-select text-xs p-1 border-gray-300 rounded-md w-full">
                                                                    <option>Receiver</option>
                                                                    <option>Received For Forward</option>
                                                                    <option>Received For Delivery</option>
                                                                </select>
                                                            </td>
                                                            <td className="p-2 truncate w-[15%]">{bag.receivedFrom}</td>
                                                        </tr>
                                                    )) : (
                                                        <tr>
                                                            <td colSpan={5} className="text-center p-4 text-gray-500">No scanned bags found.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                             </div>

                             {/* Expected Bags */}
                             <div className="space-y-2">
                                <h3 className="font-bold text-gray-700 flex items-center"><ClipboardDocumentListIcon className="w-5 h-5 mr-2" /> Expected Bags</h3>
                                 <div className="border rounded-md overflow-x-auto">
                                    <div style={{ minWidth: '700px' }}>
                                        <table className="w-full text-xs">
                                            <thead className="bg-gray-100 text-gray-600 uppercase">
                                                <tr>
                                                    <th className="p-2 text-left whitespace-nowrap">Bag Number</th>
                                                    <th className="p-2 text-left whitespace-nowrap">Despatched By</th>
                                                    <th className="p-2 text-left whitespace-nowrap">Closed From Office</th>
                                                    <th className="p-2 text-left whitespace-nowrap">Closed To office</th>
                                                    <th className="p-2 text-left whitespace-nowrap">Date of Despatch</th>
                                                </tr>
                                            </thead>
                                        </table>
                                         <div className="h-48 overflow-y-auto">
                                            <table className="w-full text-xs">
                                                <tbody className="bg-white divide-y">
                                                    {filteredExpectedBags.length > 0 ? filteredExpectedBags.map(bag => (
                                                        <tr key={bag.id}>
                                                            <td className="p-2 truncate w-1/5">{bag.bagNumber}</td>
                                                            <td className="p-2 truncate w-1/5">{bag.despatchedBy}</td>
                                                            <td className="p-2 truncate w-1/5">{bag.closedFromOffice}</td>
                                                            <td className="p-2 truncate w-1/5">{bag.closedToOffice}</td>
                                                            <td className="p-2 truncate w-1/5">{bag.dateOfDespatch}</td>
                                                        </tr>
                                                    )) : (
                                                        <tr>
                                                            <td colSpan={5} className="text-center p-4 text-gray-500">No expected bags found.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                    {/* Right Column Notifications */}
                    <div className="space-y-4">
                        <div className="flex justify-end">
                             <button className="px-4 py-1.5 text-sm font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300">
                                Fetch from RFID
                            </button>
                        </div>
                        <Notification type="warning" title="Bag Mis Routed. Check Bag Tracking Last event">
                           This is a warning message.
                        </Notification>
                        <Notification type="info" title="Bag Weight 0.961 Kg">
                           This is an info message.
                        </Notification>
                    </div>
                </div>
            </div>
        );
    }
    
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
                    <h2 className="flex-grow text-2xl font-bold text-gray-800 text-center">Bag Receipt</h2>
                    <div className="flex-1 flex justify-end">
                       <UserInfo />
                    </div>
                </div>
                <nav aria-label="Breadcrumb" className="text-sm mt-2">
                    <ol className="flex items-center space-x-2 text-gray-500">
                        <li>
                            <button onClick={handleBack} className="hover:text-gray-700 flex items-center">
                                <HomeIcon className="w-4 h-4 mr-2" />
                                {isFetched ? 'Back' : 'Home'}
                            </button>
                        </li>
                        <li><ChevronRightIcon className="w-4 h-4" /></li>
                        <li><span className="font-semibold text-gray-700">Bag Receipt</span></li>
                    </ol>
                </nav>
            </div>
            
            {isFetched ? renderReceiptView() : renderSelectionView()}

        </div>
    );
};

export default BagReceipt;