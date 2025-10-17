import React from 'react';

const Header: React.FC = () => {
    const navItems = ["Home", "Bag Management", "Booking Solution", "Exit Management", "Leave Management System", "Payroll System"];

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-2">
                <div className="flex items-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/120px-Emblem_of_India.svg.png" alt="Emblem of India" className="h-12 mr-4"/>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Department of Posts</h1>
                        <p className="text-sm text-gray-600">Ministry of Communications, Government of India</p>
                    </div>
                </div>
            </div>
            <nav className="bg-gradient-to-r from-orange-400 to-yellow-400">
                <div className="container mx-auto px-4 overflow-x-auto">
                    <ul className="flex items-center">
                        {navItems.map((item) => (
                            <li key={item} className="flex-shrink-0">
                                <a href="#" className={`block px-4 py-2 text-white font-semibold text-sm transition-colors whitespace-nowrap ${item === 'Bag Management' ? 'bg-red-600' : 'hover:bg-red-500'}`}>
                                    {item}
                                </a>
                            </li>
                        ))}
                         <li className="flex-shrink-0">
                            <a href="#" className="flex items-center px-4 py-2 text-white font-semibold text-sm hover:bg-red-500 transition-colors whitespace-nowrap">
                                Others
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;
