import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, ArrowRight, ExternalLink } from 'lucide-react';
import { Airdrop } from '../../types/Airdrop';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AirdropCardProps {
  airdrop: Airdrop;
  onClick: () => void;
}

export const AirdropCard: React.FC<AirdropCardProps> = ({ airdrop, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-[#00E272] bg-[#00E272]/10';
      case 'upcoming': return 'text-yellow-400 bg-yellow-400/10';
      case 'ended': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-[#00E272]';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-[#1A1B1E] rounded-2xl p-6 border border-gray-800 hover:border-[#00E272]/50 transition-colors cursor-pointer group flex flex-col h-full"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center overflow-hidden">
            {airdrop.logo_url ? (
              <img src={airdrop.logo_url} alt={airdrop.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-gray-400">{airdrop.name.substring(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{airdrop.name}</h3>
            {airdrop.ticker && <p className="text-sm text-gray-400">{airdrop.ticker}</p>}
          </div>
        </div>
        <span className={twMerge("px-3 py-1 rounded-full text-xs font-medium uppercase", getStatusColor(airdrop.status))}>
          {airdrop.status}
        </span>
      </div>

      <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-grow">
        {airdrop.description}
      </p>

      <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6 text-sm">
        <div>
          <p className="text-gray-500 mb-1">Est. Value</p>
          <p className="text-[#00E272] font-semibold">{airdrop.est_value || 'TBD'}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 mb-1">Chain</p>
          <p className="text-white font-medium">{airdrop.chain || 'Multi-chain'}</p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">Difficulty</p>
          <p className={twMerge("font-medium", getDifficultyColor(airdrop.difficulty))}>
            {airdrop.difficulty || 'Medium'}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-800 mt-auto">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{airdrop.participants_count ? `${(airdrop.participants_count / 1000).toFixed(1)}K` : '0'}</span>
          </div>
          {airdrop.date && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(airdrop.date).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-[#00E272] text-sm font-medium group-hover:translate-x-1 transition-transform">
          View
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
};
