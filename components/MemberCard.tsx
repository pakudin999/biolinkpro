
import React from 'react';
import { COLORS } from '../constants';
import type { TeamMember } from '../types';

interface MemberCardProps {
  member: TeamMember;
  onContact: (member: TeamMember) => void;
}

const getAvatarColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % COLORS.length);
  return COLORS[index];
};

const VerifiedIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm3.123 5.467a.75.75 0 00-1.06 1.06l1.25 1.25a.75.75 0 001.06 0l2.5-2.5a.75.75 0 00-1.06-1.06L9.39 9.22l-.722-.722z" clipRule="evenodd" />
    </svg>
);

const WhatsAppIcon: React.FC = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
    </svg>
);

const MemberCard: React.FC<MemberCardProps> = ({ member, onContact }) => {
  const initial = member.name.charAt(0).toUpperCase();
  const colorClasses = getAvatarColor(member.name);

  return (
    <div className="bg-white/25 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/30 transition-transform duration-200 ease-in-out hover:scale-102 fade-in">
      <div className="flex items-center space-x-4 mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${colorClasses}`}>
          <span className="font-semibold text-lg">{initial}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{member.name}</h3>
            <VerifiedIcon />
          </div>
          <p className="text-sm text-gray-500">Team Specialist</p>
        </div>
      </div>
      <button
        className="w-full text-gray-800 font-medium py-3 px-4 rounded-xl bg-white/30 backdrop-blur-sm border border-white/40 hover:border-green-400 hover:bg-green-100/50 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
        onClick={() => onContact(member)}
      >
        <WhatsAppIcon />
        <span>Contact</span>
      </button>
    </div>
  );
};

export default MemberCard;
