import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAirdrops } from '../../hooks/useAirdrops';
import { AirdropDetailsPage } from './AirdropDetailsPage';
import { createSlug } from '../../utils/stringUtils';

export const AirdropDetailsWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { airdrops, loading } = useAirdrops();
  
  // Find airdrop by matching the slug from URL with slugified name
  const airdrop = airdrops.find(a => createSlug(a.name) === id);

  if (loading) {
     return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00E272]"></div>
        </div>
      );
  }

  if (!airdrop) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white">
            <h2 className="text-2xl font-bold mb-4">Airdrop Not Found</h2>
            <button 
                onClick={() => navigate('/airdrop2026')}
                className="text-[#00E272] hover:underline"
            >
                Back to Airdrops
            </button>
        </div>
    );
  }

  return (
    <AirdropDetailsPage 
        airdrop={airdrop} 
        onBack={() => navigate('/airdrop2026')} 
    />
  );
};
