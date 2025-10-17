import React from 'react';

interface ManagementButtonProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

const ManagementButton: React.FC<ManagementButtonProps> = ({ title, subtitle, icon, color, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center p-4 rounded-lg text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${color} w-full text-left`}
    >
      <div className="mr-4 p-3 bg-white bg-opacity-20 rounded-full">
        {icon}
      </div>
      <div className="text-left">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm opacity-90">{subtitle}</p>
      </div>
    </button>
  );
};

export default ManagementButton;