import React, { useState, useRef, useEffect } from 'react';
import { HomeIcon, ChevronRightIcon, StarIcon } from './icons';
import UserInfo from './UserInfo';

// Mock Data
const officeData = [
    { id: '1', name: '1 CBPO PH' },
    { id: '2', name: 'Jaipur GPO' },
    { id: '3', name: 'Delhi GPO' },
];

const bagTypeData = [
    { id: 'parcel', name: 'Parcel Bag' },
    { id: 'letter', name: 'Letter Bag' },
    { id: 'speed', name: 'Speed Post Bag' },
];

const articleTypeData = ['PARCEL', 'LETTER', 'SPEED POST', 'REGISTERED'];

const expectedArticlesData = [
    { id: 'CP955543446IN', articleNumber: 'CP955543446IN', bookingOffice: 'Suratgarh S.O', toPin: '800056', artType: 'PARCEL', artWeight: 4200, ins: false },
    { id: 'RD123456789IN', articleNumber: 'RD123456789IN', bookingOffice: 'Jaipur HO', toPin: '302001', artType: 'REGISTERED', artWeight: 50, ins: true },
    { id: 'EM987654321IN', articleNumber: 'EM987654321IN', bookingOffice: 'Delhi Cantt', toPin: '110010', artType: 'SPEED POST', artWeight: 120, ins: false },
];

const initialScannedArticles = [
  { id: 'SP453321987IN', type: 'SPEED POST', insured: false, weight: 250 },
  { id: 'PA987654321IN', type: 'PARCEL', insured: true, weight: 1200 },
];

const CustomDropdown = ({ options, selectedId, onSelect, placeholder }: { options: {id: string, name: string}[], selectedId: string | null, onSelect: (id: string) => void, placeholder: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selectedOption = options.find(opt => opt.id === selectedId);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md text-sm flex justify-between items-center"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate">{selectedOption?.name || placeholder}</span>
                <ChevronRightIcon className={`w-5 h-5 text-gray-400 transition-transform transform ${isOpen ? 'rotate-90' : ''}`} />
            </button>
            {isOpen && (
                <ul className="absolute z-20 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {options.map(option => (
                        <li
                            key={option.id}
                            className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${selectedId === option.id ? 'bg-blue-600 text-white' : 'text-gray-900 hover:bg-gray-100'}`}
                            onClick={() => {
                                onSelect(option.id);
                                setIsOpen(false);
                            }}
                        >
                            <span className="block truncate">{option.name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


const BagCloseAtMO: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [isFetched, setIsFetched] = useState(false);
    const [selectedOfficeId, setSelectedOfficeId] = useState<string | null>(null);
    const [selectedBagTypeId, setSelectedBagTypeId] = useState<string | null>(null);

    // Detail view state
    const [articleNumber, setArticleNumber] = useState('');
    const [selectedArticleType, setSelectedArticleType] = useState(articleTypeData[0]);
    const [isInsured, setIsInsured] = useState(false);
    const [scannedArticles, setScannedArticles] = useState<{id: string, type: string, insured: boolean, weight: number}[]>(initialScannedArticles);

    const handleFetch = () => {
        if (selectedOfficeId && selectedBagTypeId) {
            setIsFetched(true);
        }
    };

    const handleBack = () => {
        if (isFetched) {
            setIsFetched(false);
            // Reset state
            setScannedArticles(initialScannedArticles);
            setArticleNumber('');
        } else {
            onBack();
        }
    };

    const handleAddArticle = (e: React.FormEvent) => {
        e.preventDefault();
        if(!articleNumber) return;
        const newArticle = {
            id: articleNumber,
            type: selectedArticleType,
            insured: isInsured,
            weight: Math.round(Math.random() * 500) // Mock weight
        };
        setScannedArticles(prev => [newArticle, ...prev]);
        setArticleNumber('');
        setIsInsured(false);
    };
    
    const totalScannedWeight = scannedArticles.reduce((acc, article) => acc + article.weight, 0) / 1000;

    const renderSelectionView = () => (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="w-full sm:w-1/3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Select To Office</label>
                    <CustomDropdown options={officeData} selectedId={selectedOfficeId} onSelect={setSelectedOfficeId} placeholder="Select To Office" />
                </div>
                <div className="w-full sm:w-1/3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Select bag type</label>
                    <CustomDropdown options={bagTypeData} selectedId={selectedBagTypeId} onSelect={setSelectedBagTypeId} placeholder="Select bag type" />
                </div>
                <button 
                    onClick={handleFetch}
                    disabled={!selectedOfficeId || !selectedBagTypeId}
                    className="w-full sm:w-auto px-6 py-2 h-10 text-white font-semibold bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Fetch
                </button>
            </div>
        </div>
    );

    const renderDetailView = () => (
         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
            {/* Top Selection Info */}
            <div className="flex flex-col sm:flex-row gap-4 items-end pb-4 border-b">
                <div className="w-full sm:w-1/3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Select To Office</label>
                    <p className="form-input w-full px-3 py-2 bg-gray-100 border-gray-300 rounded-md text-sm truncate">{officeData.find(o => o.id === selectedOfficeId)?.name}</p>
                </div>
                <div className="w-full sm:w-1/3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Select bag type</label>
                    <p className="form-input w-full px-3 py-2 bg-gray-100 border-gray-300 rounded-md text-sm truncate">{bagTypeData.find(b => b.id === selectedBagTypeId)?.name}</p>
                </div>
            </div>

            {/* Article Input Form */}
            <form onSubmit={handleAddArticle} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end pb-4 border-b">
                 <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Article Number</label>
                    <input type="text" value={articleNumber} onChange={e => setArticleNumber(e.target.value)} className="form-input w-full px-3 py-2 border border-gray-300 rounded-md text-sm"/>
                </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Select Article Type</label>
                    <CustomDropdown options={articleTypeData.map(t => ({id: t, name: t}))} selectedId={selectedArticleType} onSelect={setSelectedArticleType} placeholder="Select Article Type" />
                </div>
                <div className="flex items-center gap-4 pt-5">
                    <label className="flex items-center text-sm"><input type="checkbox" checked={isInsured} onChange={e => setIsInsured(e.target.checked)} className="form-checkbox h-4 w-4 mr-2" />Insured</label>
                    <button type="submit" className="px-6 py-2 text-white font-semibold bg-red-600 rounded-md hover:bg-red-700">Add</button>
                </div>
                <div className="flex items-center gap-4 text-sm pt-5">
                    <label className="flex items-center"><input type="checkbox" className="form-checkbox h-4 w-4 mr-2" />Include Bag</label>
                    <p>Scan Count: <span className="font-bold">{scannedArticles.length}</span></p>
                    <p>Bag Count: <span className="font-bold">0</span></p>
                </div>
            </form>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Scanned Articles */}
                <div className="flex flex-col">
                    <h3 className="font-bold text-gray-700 mb-2">Scanned Articles</h3>
                    <div className="border rounded-md flex-grow flex flex-col min-h-[250px]">
                        <div className="flex-grow p-4 overflow-y-auto">
                            {scannedArticles.length === 0 ? (
                                <p className="text-gray-500 text-center mt-10">Please Scan Articles</p>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {scannedArticles.map(article => (
                                        <li key={article.id} className="py-2 text-sm">
                                            {article.id} - {article.type} {article.insured && '(Insured)'}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="border-t p-3 mt-auto bg-gray-50">
                            <p className="text-sm font-semibold">Total Art Weight(kgs): {totalScannedWeight.toFixed(3)}</p>
                        </div>
                    </div>
                </div>

                {/* Expected Articles */}
                 <div className="flex flex-col">
                    <h3 className="font-bold text-gray-700 mb-2">Expected Articles</h3>
                    <div className="border rounded-md overflow-hidden flex flex-col min-h-[250px]">
                        <div className="overflow-auto flex-grow">
                            <table className="w-full text-xs text-left table-fixed" style={{ minWidth: '600px' }}>
                                <thead className="bg-gray-100 text-gray-600 uppercase sticky top-0">
                                    <tr>
                                        <th className="p-2 w-[30%]">Article Number</th>
                                        <th className="p-2 w-[25%]">Booking Office</th>
                                        <th className="p-2 w-[15%]">ToPin</th>
                                        <th className="p-2 w-[15%]">Art Type</th>
                                        <th className="p-2 w-[10%]">Art Weight</th>
                                        <th className="p-2 w-[5%]">INS</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {expectedArticlesData.map(article => (
                                        <tr key={article.id}>
                                            <td className="p-2 truncate w-[30%]">{article.articleNumber}</td>
                                            <td className="p-2 truncate w-[25%]">{article.bookingOffice}</td>
                                            <td className="p-2 w-[15%]">{article.toPin}</td>
                                            <td className="p-2 w-[15%]">{article.artType}</td>
                                            <td className="p-2 w-[10%]">{article.artWeight}</td>
                                            <td className="p-2 w-[5%]"><input type="checkbox" checked={article.ins} readOnly className="form-checkbox" /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="border-t p-2 mt-auto bg-gray-50 flex justify-between items-center text-xs">
                             <p>Rows per page: 8</p>
                             <div className="flex items-center space-x-2">
                                <p>1-1 of 1</p>
                                <div className="flex space-x-1">
                                    <button className="p-1 rounded hover:bg-gray-200 disabled:opacity-50" disabled>&lt;</button>
                                    <button className="p-1 rounded hover:bg-gray-200 disabled:opacity-50" disabled>&gt;</button>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
             {/* Bottom Bar */}
            <div className="flex justify-end pt-4 border-t">
                 <button className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
            </div>
        </div>
    );


    return (
        <div className="relative z-10 animate-fade-in">
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                    <div className="flex-1 self-start sm:self-center">
                        <button className="flex items-center text-sm text-gray-600 hover:text-blue-600">
                            <StarIcon className="w-4 h-4 mr-2" />
                            Favourites (Ctrl+A)
                        </button>
                    </div>
                    <h2 className="flex-grow text-2xl font-bold text-gray-800 text-center order-first sm:order-none">Bag Close At MO</h2>
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
                        <li><span className="font-semibold text-gray-700">Bag Close at MO</span></li>
                    </ol>
                </nav>
            </div>
            
            {isFetched ? renderDetailView() : renderSelectionView()}
        </div>
    );
};

export default BagCloseAtMO;
