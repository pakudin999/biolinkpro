
import React from 'react';

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: 'contact' | 'group') => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const contactClasses = activeTab === 'contact'
    ? 'bg-amber-400 text-amber-900 shadow-lg'
    : 'bg-white/30 text-gray-700 hover:bg-white/40';

  const groupClasses = activeTab === 'group'
    ? 'bg-amber-400 text-amber-900 shadow-lg'
    : 'bg-white/30 text-gray-700 hover:bg-white/40';

  return (
    <div className="mb-6 bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-xl">
      <div className="flex space-x-2">
        <button
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${contactClasses}`}
          onClick={() => setActiveTab('contact')}
        >
          CONTACT
        </button>
        <button
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${groupClasses}`}
          onClick={() => setActiveTab('group')}
        >
          GROUP OFFICIAL
        </button>
      </div>
    </div>
  );
};

export default Tabs;
