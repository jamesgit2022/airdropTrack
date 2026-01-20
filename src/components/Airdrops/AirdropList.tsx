import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAirdrops } from '../../hooks/useAirdrops';
import { AirdropCard } from './AirdropCard';
import { AddAirdropModal } from './AddAirdropModal';
import { AirdropStatus } from '../../types/Airdrop';
import { clsx } from 'clsx';
import { createSlug } from '../../utils/stringUtils';

export const AirdropList: React.FC = () => {
  const { airdrops, loading, isAdmin, addAirdrop } = useAirdrops();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<AirdropStatus | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  const filteredAirdrops = airdrops.filter(airdrop => {
    const matchesSearch = airdrop.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          airdrop.ticker?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || airdrop.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const FilterButton = ({ label, value }: { label: string; value: AirdropStatus | 'all' }) => (
    <button
      onClick={() => setActiveFilter(value)}
      className={clsx(
        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
        activeFilter === value
          ? "bg-[#00E272] text-black"
          : "bg-[#1A1B1E] text-gray-400 hover:bg-gray-800"
      )}
    >
      {label} ({value === 'all' ? airdrops.length : airdrops.filter(a => a.status === value).length})
    </button>
  );

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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Latest Airdrops</h2>
              <p className="text-gray-400">Discover and participate in the hottest crypto airdrops</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <FilterButton label="All" value="all" />
              <FilterButton label="Active" value="active" />
              <FilterButton label="Upcoming" value="upcoming" />
              <FilterButton label="Ended" value="ended" />
              
              {isAdmin && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="ml-4 flex items-center gap-2 px-4 py-2 bg-[#00E272] text-black rounded-lg font-bold hover:bg-[#00c965] transition-colors"
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
