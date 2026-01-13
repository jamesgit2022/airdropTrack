import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, MessageCircle, Twitter, Send, ExternalLink, CheckCircle, AlertTriangle, BookOpen, Edit, Trash2 } from 'lucide-react';
import { Airdrop } from '../../types/Airdrop';
import { twMerge } from 'tailwind-merge';
import { useAirdrops } from '../../hooks/useAirdrops';
import { EditAirdropModal } from './EditAirdropModal';
import { ConfirmationModal } from '../ConfirmationModal';
import { useNavigate } from 'react-router-dom';

interface AirdropDetailsPageProps {
  airdrop: Airdrop;
  onBack: () => void;
}

export const AirdropDetailsPage: React.FC<AirdropDetailsPageProps> = ({ airdrop, onBack }) => {
  const { isAdmin, updateAirdrop, deleteAirdrop } = useAirdrops();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteAirdrop(airdrop.id);
      navigate('/airdrop2026');
    } catch (error) {
      console.error('Failed to delete airdrop:', error);
      alert('Failed to delete airdrop');
    }
  };

  const renderMarkdown = (text: string) => {
    // Split by patterns: [text](url), **bold**, *italic*, or raw URLs
    const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|https?:\/\/[^\s]+)/g);

    return parts.map((part, index) => {
      // Link [text](url)
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        return (
          <a 
            key={index} 
            href={linkMatch[2]} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#00E272] hover:underline"
          >
            {linkMatch[1]}
          </a>
        );
      }

      // Bold **text**
      const boldMatch = part.match(/^\*\*(.+)\*\*$/);
      if (boldMatch) {
        return <strong key={index} className="text-white font-bold">{boldMatch[1]}</strong>;
      }

      // Italic *text*
      const italicMatch = part.match(/^\*(.+)\*$/);
      if (italicMatch) {
        return <em key={index} className="italic text-gray-200">{italicMatch[1]}</em>;
      }

      // Raw URL
      if (part.match(/^https?:\/\//)) {
        return (
          <a 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#00E272] hover:underline"
          >
            {part}
          </a>
        );
      }

      return part;
    });
  };

  return (
    <div className="min-h-screen text-white p-6 md:p-12 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Airdrops
          </button>

          {isAdmin && (
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Airdrop
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-900/20 text-red-400 border border-red-900/50 rounded-lg hover:bg-red-900/40 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header Card */}
            <div className="bg-[#1A1B1E] rounded-2xl p-8 border border-gray-800 relative overflow-hidden group/card hover:border-[#00E272]/30 transition-all duration-500">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E272]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none transition-opacity duration-500 group-hover/card:opacity-100" />
              
              <div className="flex items-start gap-6 relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {airdrop.logo_url ? (
                    <img src={airdrop.logo_url} alt={airdrop.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-gray-400">{airdrop.name.substring(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">{airdrop.name}</h1>
                    <span className={twMerge(
                      "px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider",
                      airdrop.status === 'active' ? "bg-[#00E272]/10 text-[#00E272]" :
                      airdrop.status === 'upcoming' ? "bg-yellow-400/10 text-yellow-400" :
                      "bg-gray-400/10 text-gray-400"
                    )}>
                      {airdrop.status}
                    </span>
                  </div>
                  <p className="text-gray-400 font-medium mb-4">
                    {airdrop.ticker || airdrop.name} • {airdrop.chain || 'Multi-chain'}
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    {airdrop.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Requirements / Instructions */}
            <div className="bg-[#1A1B1E] rounded-2xl p-8 border border-gray-800 relative overflow-hidden group/card hover:border-[#00E272]/30 transition-all duration-500">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E272]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none transition-opacity duration-500 group-hover/card:opacity-100" />

              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="p-3 bg-[#00E272]/10 rounded-xl border border-[#00E272]/20">
                  <BookOpen className="w-6 h-6 text-[#00E272]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">How To Join</h2>
                  <p className="text-gray-400 text-sm mt-1">Follow these steps to participate</p>
                </div>
              </div>
              
              <div className="space-y-6 relative z-10">
                {airdrop.instruction ? (
                  <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {renderMarkdown(airdrop.instruction)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-gray-800 rounded-xl bg-gray-900/50">
                    <BookOpen className="w-12 h-12 text-gray-700 mb-3" />
                    <p className="text-gray-500 font-medium">No instructions available yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-900/10 rounded-xl p-4 border border-yellow-900/30 flex gap-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
              <p className="text-sm text-yellow-500/90 leading-relaxed">
                Always do your own research (DYOR) before participating in any airdrop. Never share your private keys or seed phrases. 
                AirdropHub does not guarantee any airdrop distributions.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Details Card */}
            <div className="bg-[#1A1B1E] rounded-2xl p-6 border border-gray-800 relative overflow-hidden group/card hover:border-[#00E272]/30 transition-all duration-500">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E272]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none transition-opacity duration-500 group-hover/card:opacity-100" />
              
              <h3 className="text-lg font-bold text-white mb-6 relative z-10">Details</h3>
              
              <div className="space-y-5 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Est. Value</span>
                  <span className="text-[#00E272] font-bold text-lg">{airdrop.est_value || 'TBD'}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Difficulty</span>
                  <span className={twMerge(
                    "font-medium",
                    airdrop.difficulty === 'Easy' ? "text-[#00E272]" :
                    airdrop.difficulty === 'Medium' ? "text-yellow-400" :
                    "text-red-400"
                  )}>{airdrop.difficulty || 'Medium'}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Category</span>
                  <span className="text-white font-medium">{airdrop.chain || 'Multi-chain'}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Funding</span>
                  <span className="text-white font-medium">
                    {airdrop.funding 
                      ? (airdrop.funding.startsWith('$') ? airdrop.funding : `$${airdrop.funding}`)
                      : 'TBD'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Date</span>
                  <span className="text-white font-medium">
                    {airdrop.date ? new Date(airdrop.date).toLocaleDateString() : 'TBD'}
                  </span>
                </div>
              </div>
            </div>

            {/* Links Card */}
            <div className="bg-[#1A1B1E] rounded-2xl p-6 border border-gray-800 relative overflow-hidden group/card hover:border-[#00E272]/30 transition-all duration-500">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E272]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none transition-opacity duration-500 group-hover/card:opacity-100" />
              
              <h3 className="text-lg font-bold text-white mb-6 relative z-10">Links</h3>
              
              <div className="space-y-3 relative z-10">
                {airdrop.website && (
                  <a 
                    href={airdrop.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-900/50 rounded-xl hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400 group-hover:text-white" />
                      <span className="text-gray-300 group-hover:text-white font-medium">Website</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white" />
                  </a>
                )}
                
                {airdrop.twitter && (
                  <a 
                    href={airdrop.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-900/50 rounded-xl hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white" />
                      <span className="text-gray-300 group-hover:text-white font-medium">Twitter</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white" />
                  </a>
                )}

                {airdrop.discord && (
                  <a 
                    href={airdrop.discord} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-900/50 rounded-xl hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-gray-400 group-hover:text-white" />
                      <span className="text-gray-300 group-hover:text-white font-medium">Discord</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white" />
                  </a>
                )}

                {airdrop.telegram && (
                  <a 
                    href={airdrop.telegram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-900/50 rounded-xl hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Send className="w-5 h-5 text-gray-400 group-hover:text-white" />
                      <span className="text-gray-300 group-hover:text-white font-medium">Telegram</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white" />
                  </a>
                )}
              </div>

              {airdrop.website && (
                <a 
                  href={airdrop.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-[#00E272] hover:bg-[#00c965] text-black font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-[#00E272]/20 relative z-10"
                >
                  Start Airdrop
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <EditAirdropModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={updateAirdrop}
        airdrop={airdrop}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Airdrop"
        message="Are you sure you want to delete this airdrop? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        variant="danger"
      />
    </div>
  );
};
