import React, { useState, useMemo, useRef, useEffect } from 'react';
import { HomeIcon, ChevronRightIcon, StarIcon, ClipboardDocumentListIcon, QrCodeIcon } from './icons';
import UserInfo from './UserInfo';

// This data is formatted to match the style shown in the user's image.
const scheduleData = [
  { id: "100001", description: "Jaipur RMS/TMO-1 RMS/L/1 18:00, RTN Schedule" },
  { id: "100002", description: "Jaipur City/Jaipur-TMO Beawar (MSL)/L/1 18:00, RTN Schedule" },
  { id: "100003", description: "Jaipur City/Jaipur-TMO Deoli (Tonk) 19:00, RTN Schedule" },
  { id: "100004", description: "Jaipur City/Jaipur-TMO Deoli PAR L/1L/ 22:30, RTN Schedule" },
  { id: "100005", description: "Jaipur City/Jaipur-Phalodi SO(Jodhpur) 20:15, RTN Schedule" },
  { id: "100006", description: "Jaipur City/Jaipur-TMO Ajmer(L) RMS/L/1L 21:00, RTN Schedule" },
  { id: "100007", description: "Ajmer MS/TMO Khairthal MS/TMO 15:00 RTN Schedule" },
];

const scannedBagsData = [
  { id: 'LBX9997942622', closedTo: 'Alisyn RMS/LTO', destination: 'Alisyn RMS/LTO', bagType: 'Ordinary Mail', weight: 3.70, closedBy: 'USER1', receivedAt: 'Jaipur Mo. RMS TMO' },
  { id: 'LB100000123786', closedTo: 'Asan Jn', destination: 'Asan Jn. RMS/LTO', bagType: 'Parcel Bag', weight: 2.5, closedBy: 'USER2', receivedAt: 'Jaipur Mo. RMS TMO' },
  { id: 'LBF0934547104', closedTo: 'Jaipur HO', destination: 'Jaipur HO', bagType: 'Parcel Bag', weight: 0.8, closedBy: 'USER1', receivedAt: 'Jaipur Mo. RMS TMO' },
  { id: 'LBF0934547121', closedTo: 'Ajmer HO', destination: 'Ajmer HO', bagType: 'Ordinary Mail', weight: 3.1, closedBy: 'USER3', receivedAt: 'Jaipur Mo. RMS TMO' },
  { id: 'LB100000123788', closedTo: 'Delhi GPO', destination: 'Delhi GPO', bagType: 'Parcel Bag', weight: 5.0, closedBy: 'USER2', receivedAt: 'Jaipur Mo. RMS TMO' },
  { id: 'LXX0002805540', closedTo: 'Mumbai GPO', destination: 'Mumbai GPO', bagType: 'Parcel Bag', weight: 1.5, closedBy: 'USER1', receivedAt: 'Jaipur Mo. RMS TMO' },
];

const expectedBagsData = [
    { id: 'CB40081236730', bagNumber: 'CB40081236730', closedBy: 'SYS', receivedAt: 'Jaipur Mo. RMS TMO', closedTo: 'Jaipur GPO', destination: 'Jaipur GPO', bagType: 'Parcel Bag', weight: 1.20 },
    { id: 'CB40081237819', bagNumber: 'CB40081237819', closedBy: 'SYS', receivedAt: 'Jaipur Mo. RMS TMO', closedTo: 'Ajmer HO', destination: 'Ajmer HO', bagType: 'Parcel Bag', weight: 0.80 },
    { id: 'CB40081238047', bagNumber: 'CB40081238047', closedBy: 'SYS', receivedAt: 'Jaipur Mo. RMS TMO', closedTo: 'Kota HO', destination: 'Kota HO', bagType: 'Parcel Bag', weight: 2.10 },
    { id: 'CB40081238370', bagNumber: 'CB40081238370', closedBy: 'SYS', receivedAt: 'Jaipur Mo. RMS TMO', closedTo: 'Jodhpur HO', destination: 'Jodhpur HO', bagType: 'Parcel Bag', weight: 1.55 },
    { id: 'CB40081239538', bagNumber: 'CB40081239538', closedBy: 'SYS', receivedAt: 'Jaipur Mo. RMS TMO', closedTo: 'Udaipur HO', destination: 'Udaipur HO', bagType: 'Parcel Bag', weight: 1.40 },
    { id: 'CB40081441204', bagNumber: 'CB40081441204', closedBy: 'SYS', receivedAt: 'Jaipur Mo. RMS TMO', closedTo: 'Bikaner HO', destination: 'Bikaner HO', bagType: 'Parcel Bag', weight: 1.00 },
];

const BagDetailsFooter: React.FC<{ bag: any; totalWeight?: string }> = ({ bag, totalWeight }) => {
    const displayWeight = totalWeight ?? (bag?.weight ? bag.weight.toFixed(2) : '0.00');
    
    if (!bag && !totalWeight) return (
        <div className="border-t p-3 mt-auto bg-gray-50 text-center text-gray-500 text-sm">
            Select a bag to see details.
        </div>
    );

    return (
        <div className="border-t p-3 mt-auto bg-gray-50">
             <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                    <div className="font-semibold text-gray-500">Closed To</div>
                    <div className="text-gray-800">{bag?.closedTo || '-'}</div>
                </div>
                <div>
                    <div className="font-semibold text-gray-500">Destination</div>
                    <div className="text-gray-800">{bag?.destination || '-'}</div>
                </div>
                <div className="relative">
                    <div className="font-semibold text-gray-500">BagType</div>
                    <div className="text-gray-800">{bag?.bagType || '-'}</div>
                    <div className="absolute bottom-0 right-0 flex items-center justify-end space-x-2 opacity-50">
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    </div>
                </div>
            </div>
            <div className="border-t mt-3 pt-2">
                <p className="text-sm font-semibold text-gray-600">
                    Total Weight : {displayWeight} kg
                </p>
            </div>
        </div>
    );
};


const BagDespatch: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isFetched, setIsFetched] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);

  // State for the despatch view
  const [scannedBags, setScannedBags] = useState(scannedBagsData.slice(0, 2));
  const [expectedBags] = useState(expectedBagsData);
  const [selectedScannedBagId, setSelectedScannedBagId] = useState<string | null>(scannedBagsData[0].id);
  const [selectedExpectedBagId, setSelectedExpectedBagId] = useState<string | null>(null);

  const [bagNumberInput, setBagNumberInput] = useState('');
  const [bagWeightInput, setBagWeightInput] = useState('');
  
  // State for custom dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleFetch = () => {
    if (selectedScheduleId) {
      setIsFetched(true);
    } else {
      alert("Please select a schedule first.");
    }
  };

  const handleBack = () => {
    if (isFetched) {
      setIsFetched(false);
    } else {
      onBack();
    }
  };
  
  const handleAddBag = (e: React.FormEvent) => {
    e.preventDefault();
    if (bagNumberInput && bagWeightInput) {
        const newBag = {
            id: bagNumberInput,
            closedTo: 'Alisyn RMS/LTO',
            destination: 'Alisyn RMS/LTO',
            bagType: 'Ordinary Mail',
            weight: parseFloat(bagWeightInput),
            closedBy: 'USER',
            receivedAt: 'Jaipur Mo. RMS TMO'
        };
        setScannedBags([newBag, ...scannedBags]);
        setSelectedScannedBagId(newBag.id);
        setBagNumberInput('');
        setBagWeightInput('');
    }
  }

  const filteredScannedBags = useMemo(() => {
    return scannedBags.filter(bag => {
      const bagId = bag.id || '';
      const bagWeight = bag.weight?.toString() || '';
      const matchesNumber = bagId.toLowerCase().includes(bagNumberInput.toLowerCase());
      const matchesWeight = bagWeightInput ? bagWeight.includes(bagWeightInput) : true;
      return matchesNumber && matchesWeight;
    });
  }, [scannedBags, bagNumberInput, bagWeightInput]);

  const filteredExpectedBags = useMemo(() => {
    return expectedBags.filter(bag => {
      const bagId = bag.id || '';
      const bagWeight = bag.weight?.toString() || '';
      const matchesNumber = bagId.toLowerCase().includes(bagNumberInput.toLowerCase());
      const matchesWeight = bagWeightInput ? bagWeight.includes(bagWeightInput) : true;
      return matchesNumber && matchesWeight;
    });
  }, [expectedBags, bagNumberInput, bagWeightInput]);
  
  const selectedScannedBagDetails = scannedBags.find(bag => bag.id === selectedScannedBagId);
  const selectedExpectedBagDetails = expectedBags.find(bag => bag.id === selectedExpectedBagId);
  const totalScannedWeight = scannedBags.reduce((sum, bag) => sum + bag.weight, 0).toFixed(2);
  const totalExpectedWeight = expectedBags.reduce((sum, bag) => sum + bag.weight, 0).toFixed(2);


  const renderScheduleSelectionView = () => {
    const selectedSchedule = scheduleData.find(item => item.id === selectedScheduleId);
    const displayValue = selectedSchedule 
        ? `${selectedSchedule.id} - ${selectedSchedule.description}` 
        : 'Select a schedule...';

    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
          {/* Custom Dropdown */}
          <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                className="block w-full px-4 py-2 text-left text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                <span className="truncate">{displayValue}</span>
                <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 3a.75.75 0 01.53.22l3.5 3.5a.75.75 0 01-1.06 1.06L10 4.81 6.53 8.28a.75.75 0 01-1.06-1.06l3.5-3.5A.75.75 0 0110 3zm-3.72 9.28a.75.75 0 011.06 0L10 15.19l2.67-2.91a.75.75 0 111.06 1.06l-3.25 3.5a.75.75 0 01-1.06 0l-3.25-3.5a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
            </button>
            {isDropdownOpen && (
                <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    <li 
                        className="text-gray-500 cursor-default select-none relative py-2 pl-3 pr-9"
                    >
                        Select a schedule...
                    </li>
                    {scheduleData.map((item) => (
                        <li
                            key={item.id}
                            className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${selectedScheduleId === item.id ? 'bg-blue-600 text-white' : 'text-gray-900 hover:bg-gray-100'}`}
                            onClick={() => {
                                setSelectedScheduleId(item.id);
                                setIsDropdownOpen(false);
                            }}
                        >
                            <span className={`block whitespace-normal ${selectedScheduleId === item.id ? 'font-semibold' : 'font-normal'}`}>
                                {item.id} - {item.description}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
          </div>
          <button 
              onClick={handleFetch} 
              className="px-6 py-2 text-white font-semibold bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 flex-shrink-0 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!selectedScheduleId}
          >
            Fetch
          </button>
        </div>
      </div>
    );
  };
  
  const renderDespatchView = () => {
    const selectedSchedule = scheduleData.find(s => s.id === selectedScheduleId);
    return (
        <div className="bg-white p-4 rounded-md shadow-md border border-gray-200">
            {/* Top Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b pb-4 mb-4">
                <div className="md:col-span-1">
                    <span className="font-semibold text-gray-600">Schedule:</span>
                    <p className="text-sm text-gray-800 truncate" title={selectedSchedule?.description}>{selectedSchedule?.description}</p>
                </div>
                <form onSubmit={handleAddBag} className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                    <input type="text" placeholder="Bag Number" value={bagNumberInput} onChange={e => setBagNumberInput(e.target.value)} className="form-input w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <input type="number" step="0.01" placeholder="Bag Weight (kg)" value={bagWeightInput} onChange={e => setBagWeightInput(e.target.value)} className="form-input w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <button type="submit" className="px-4 py-1.5 text-white font-semibold bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 text-sm">OK</button>
                </form>
            </div>
            <div className="flex justify-between items-center mb-4">
                <div className="font-semibold text-gray-700">Scan Count : {scannedBags.length}</div>
                <button className="px-4 py-1.5 text-sm text-red-700 font-semibold bg-white border border-red-500 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400">Fetch From MO'S</button>
            </div>
            
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 border-t pt-4">
                {/* Left Column: Scanned Bags */}
                <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-gray-700 mb-2 flex items-center">
                        <QrCodeIcon className="w-5 h-5 mr-2 text-gray-500" />
                        Scanned Bags
                    </h3>
                    <div className="border rounded-md flex-grow flex flex-col overflow-hidden">
                         <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left" style={{ minWidth: '600px' }}>
                                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                    <tr className="table w-full table-fixed">
                                        <th className="p-2 w-1/3 whitespace-nowrap">BagNumber</th>
                                        <th className="p-2 w-1/3 whitespace-nowrap">Closed To</th>
                                        <th className="p-2 w-1/3 whitespace-nowrap">BagType</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 h-48 block overflow-y-auto">
                                    {filteredScannedBags.map(bag => (
                                        <tr 
                                            key={bag.id}
                                            onClick={() => setSelectedScannedBagId(bag.id)}
                                            className={`table w-full table-fixed cursor-pointer ${selectedScannedBagId === bag.id ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
                                        >
                                            <td className="p-2 whitespace-nowrap">{bag.id}</td>
                                            <td className="p-2 whitespace-nowrap">{bag.closedTo}</td>
                                            <td className="p-2 whitespace-nowrap">{bag.bagType}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <BagDetailsFooter bag={selectedScannedBagDetails} totalWeight={totalScannedWeight} />
                    </div>
                </div>

                {/* Right Column: Expected Bags */}
                <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-gray-700 mb-2 flex items-center"><ClipboardDocumentListIcon className="w-5 h-5 mr-2 text-gray-500" /> Expected Bags</h3>
                    <div className="border rounded-md flex-grow flex flex-col overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left" style={{ minWidth: '600px' }}>
                                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                    <tr className="table w-full table-fixed">
                                        <th className="p-2 w-1/3 whitespace-nowrap">BagNumber</th>
                                        <th className="p-2 w-1/3 whitespace-nowrap">Received at</th>
                                        <th className="p-2 w-1/3 whitespace-nowrap">BagType</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 h-48 block overflow-y-auto">
                                    {filteredExpectedBags.map(bag => (
                                        <tr 
                                            key={bag.id} 
                                            onClick={() => setSelectedExpectedBagId(bag.id)}
                                            className={`table w-full table-fixed cursor-pointer ${selectedExpectedBagId === bag.id ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
                                        >
                                            <td className="p-2 truncate" title={bag.bagNumber}>{bag.bagNumber}</td>
                                            <td className="p-2 whitespace-nowrap">{bag.receivedAt}</td>
                                            <td className="p-2 whitespace-nowrap">{bag.bagType}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <BagDetailsFooter bag={selectedExpectedBagDetails} totalWeight={totalExpectedWeight} />
                    </div>
                </div>
            </div>
            
            {/* Bottom Bar */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
                 <p className="text-xs text-gray-500">Please verify details before despatch.</p>
                 <div className="flex items-center space-x-2">
                     <button className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">Save Draft</button>
                     <button className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">Despatch Bags</button>
                     <button className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Clear</button>
                 </div>
            </div>
        </div>
    );
  };
  
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
            <h2 className="flex-grow text-2xl font-bold text-gray-800 text-center">Bag Despatch</h2>
            <div className="flex-1 flex justify-end">
                <UserInfo />
            </div>
        </div>
        <nav aria-label="Breadcrumb" className="text-sm mt-2">
            <ol className="flex items-center space-x-2 text-gray-500">
                <li>
                    <button onClick={handleBack} className="hover:text-gray-700 flex items-center">
                        <HomeIcon className="w-4 h-4 mr-2" />
                        Home
                    </button>
                </li>
                <li><ChevronRightIcon className="w-4 h-4" /></li>
                <li><span className="font-semibold text-gray-700">Bag Despatch</span></li>
            </ol>
        </nav>
      </div>
      {isFetched ? renderDespatchView() : renderScheduleSelectionView()}
    </div>
  );
};

export default BagDespatch;