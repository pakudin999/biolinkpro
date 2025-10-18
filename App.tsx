
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import SearchBar from './components/SearchBar';
import TeamGrid from './components/TeamGrid';
import GroupSection from './components/GroupSection';
import ConfirmationModal from './components/ConfirmationModal';
import { TEAM_MEMBERS } from './constants';
import type { TeamMember } from './types';

enum ActiveTab {
  Contact = 'contact',
  Group = 'group',
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.Contact);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const filteredMembers = useMemo(() => {
    if (!searchTerm) {
      return TEAM_MEMBERS;
    }
    return TEAM_MEMBERS.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleContactClick = (member: TeamMember) => {
    setSelectedMember(member);
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
  };

  const handleConfirmContact = () => {
    if (selectedMember) {
      const message = encodeURIComponent(`Hi ${selectedMember.name}, I would like to get in touch with you.`);
      const whatsappUrl = `https://wa.me/${selectedMember.phone}?text=${message}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setSelectedMember(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 relative font-sans">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-amber-300 to-yellow-400 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-orange-300 to-amber-300 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-amber-200 to-yellow-300 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <Header />
        {/* FIX: The state setter from `useState` has a broader type than the one expected by the `Tabs` component, causing a type mismatch. Wrapping it in a lambda function resolves this issue by creating a function with the correct signature. */}
        <Tabs activeTab={activeTab} setActiveTab={(tab) => setActiveTab(tab)} />

        {activeTab === ActiveTab.Contact && (
          <div className="fade-in">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <main className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl">
              <TeamGrid members={filteredMembers} onContact={handleContactClick} />
            </main>
          </div>
        )}

        {activeTab === ActiveTab.Group && (
          <div className="fade-in">
            <GroupSection />
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!selectedMember}
        member={selectedMember}
        onClose={handleCloseModal}
        onConfirm={handleConfirmContact}
      />
    </div>
  );
}
