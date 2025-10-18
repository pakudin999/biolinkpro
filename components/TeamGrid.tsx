
import React from 'react';
import MemberCard from './MemberCard';
import type { TeamMember } from '../types';

interface TeamGridProps {
  members: TeamMember[];
  onContact: (member: TeamMember) => void;
}

const NoResults: React.FC = () => (
  <div className="text-center py-12">
    <div className="text-gray-400 mb-4">
      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-600 mb-2">No specialists found</h3>
    <p className="text-gray-500">Try adjusting your search terms</p>
  </div>
);

const TeamGrid: React.FC<TeamGridProps> = ({ members, onContact }) => {
  if (members.length === 0) {
    return <NoResults />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map(member => (
        <MemberCard key={member.name} member={member} onContact={onContact} />
      ))}
    </div>
  );
};

export default TeamGrid;
