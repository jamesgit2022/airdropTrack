import React, { useState } from 'react';
import { Search, Plus, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAirdrops } from '../../hooks/useAirdrops';
import { AirdropCard } from './AirdropCard';
import { AddAirdropModal } from './AddAirdropModal';
import { AirdropStatus } from '../../types/Airdrop';
import { clsx } from 'clsx';
import { createSlug } from '../../utils/stringUtils';

type FilterType = AirdropStatus | 'all' | 'daily_task' | 'waitlist';

export const AirdropList: React.FC = () => {
  const { airdrops, loading, isAdmin, addAirdrop } = useAirdrops();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  const filteredAirdrops = airdrops.filter(airdrop => {
    const matchesSearch = airdrop.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          airdrop.ticker?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (activeFilter === 'all') {
      matchesFilter = true;
    } else if (activeFilter === 'daily_task') {
      matchesFilter = !!airdrop.has_daily_task;
    } else if (activeFilter === 'waitlist') {
      matchesFilter = !!airdrop.is_waitlist;
    } else {
      matchesFilter = airdrop.status === activeFilter;
    }

    return matchesSearch && matchesFilter;
  });

  const getCount = (filter: FilterType) => {
    if (filter === 'all') return airdrops.length;
    if (filter === 'daily_task') return airdrops.filter(a => a.has_daily_task).length;
    if (filter === 'waitlist') return airdrops.filter(a => a.is_waitlist).length;
    return airdrops.filter(a => a.status === filter).length;
  };

  return (
    <div className="min-h-screen text-white p-6 md:p-12 relative z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold">
            Find Free <span className="text-[#00E272]">Crypto Airdrops</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Your gateway to discovering legitimate airdrops from top blockchain projects. Never miss an opportunity to earn free tokens.
          </p>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search airdrops by name, chain, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1B1E] border border-gray-800 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#00E272] transition-colors"
            />
          </div>
        </div>



        {/* Latest Airdrops Section */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Latest Airdrops</h2>
              <p className="text-gray-400">Discover and participate in the hottest crypto airdrops</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value as FilterType)}
                  className="bg-[#1A1B1E] border border-gray-800 rounded-lg pl-4 pr-10 py-2 text-white focus:outline-none focus:border-[#00E272] appearance-none cursor-pointer hover:bg-gray-800 transition-colors"
                >
                  <option value="all">All ({getCount('all')})</option>
                  <option value="active">Active ({getCount('active')})</option>
                  <option value="upcoming">Upcoming ({getCount('upcoming')})</option>
                  <option value="ended">Ended ({getCount('ended')})</option>
                  <option value="daily_task">Daily Task ({getCount('daily_task')})</option>
                  <option value="waitlist">Waitlist ({getCount('waitlist')})</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              
              {isAdmin && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#00E272] text-black rounded-lg font-bold hover:bg-[#00c965] transition-colors whitespace-nowrap"
                >
                  <Plus className="w-5 h-5" />
                  Add Post
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00E272]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAirdrops.map((airdrop) => (
                <AirdropCard
                  key={airdrop.id}
                  airdrop={airdrop}
                  to={`/airdrop2026/${createSlug(airdrop.name)}`}
                />
              ))}
            </div>
          )}

          {!loading && filteredAirdrops.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No airdrops found matching your criteria.
            </div>
          )}
        </div>
      </div>

      <AddAirdropModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addAirdrop}
      />
    </div>
  );
};
