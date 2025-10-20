import React from 'react';
import { Star } from 'lucide-react';

interface ProfileStatsProps {
  totalSessions: number;
  totalClients: number;
  rating: number;
  experience: number;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ totalSessions, totalClients, rating }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
        <div className="text-2xl font-bold text-gray-900">{totalSessions}</div>
        <div className="text-sm text-gray-600">Sessions</div>
      </div>
      <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
        <div className="text-2xl font-bold text-gray-900">{totalClients}</div>
        <div className="text-sm text-gray-600">Clients</div>
      </div>
      <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
        <div className="flex items-center justify-center gap-1">
          <div className="text-2xl font-bold text-gray-900">{rating}</div>
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
        </div>
        <div className="text-sm text-gray-600">Rating</div>
      </div>
      {/* <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
        <div className="text-2xl font-bold text-gray-900">{experience}+</div>
        <div className="text-sm text-gray-600">Years</div>
      </div> */}
    </div>
  );
};

export default ProfileStats;
