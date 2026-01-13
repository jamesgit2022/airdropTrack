import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bold, Italic, Link as LinkIcon } from 'lucide-react';
import { Airdrop, AirdropStatus, AirdropDifficulty } from '../../types/Airdrop';

interface AddAirdropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (airdrop: Omit<Airdrop, 'id' | 'created_at'>) => Promise<any>;
}

export const AddAirdropModal: React.FC<AddAirdropModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Airdrop>>({
    status: 'upcoming',
    difficulty: 'Medium',
    participants_count: 0
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormat = (prefix: string, suffix: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    const newText = text.substring(0, start) + prefix + text.substring(start, end) + suffix + text.substring(end);
    
    setFormData(prev => ({ ...prev, instruction: newText }));
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setLoading(true);
    try {
      await onAdd(formData as Omit<Airdrop, 'id' | 'created_at'>);
      onClose();
      setFormData({ status: 'upcoming', difficulty: 'Medium', participants_count: 0 });
    } catch (error) {
      console.error(error);
      alert('Failed to add airdrop');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#1A1B1E] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-800 shadow-2xl"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">Add New Airdrop</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name *</label>
                <input
                  required
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00E272]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Ticker</label>
                <input
                  name="ticker"
                  value={formData.ticker || ''}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00E272]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Logo URL</label>
              <input
                name="logo_url"
                value={formData.logo_url || ''}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00E272]"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00E272]"
                >
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ended">Ended</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00E272]"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Chain</label>
                <input
                  name="chain"
                  value={formData.chain || ''}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00E272]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={3}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00E272]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Instructions</label>
              <div className="flex items-center gap-2 mb-2 bg-gray-800/50 p-2 rounded-lg border border-gray-700">
                <button type="button" onClick={() => insertFormat('**', '**')} className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white" title="Bold">
                  <Bold className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => insertFormat('*', '*')} className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white" title="Italic">
                  <Italic className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => insertFormat('[', '](url)')} className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white" title="Link">
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>
              <textarea
                ref={textareaRef}
                name="instruction"
                value={formData.instruction || ''}
                onChange={handleChange}
                rows={4}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00E272]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Est. Value</label>
                <input
                  name="est_value"
                  value={formData.est_value || ''}
                  onChange={handleChange}
                  placeholder="$500 - $5,000"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00E272]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value ? new Date(e.target.value).toISOString() : undefined }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00E272]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Website</label>
                <input
                  name="website"
                  value={formData.website || ''}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00E272]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">X(Twitter)</label>
                <input
                  name="twitter"
                  value={formData.twitter || ''}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00E272]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Discord</label>
                <input
                  name="discord"
                  value={formData.discord || ''}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00E272]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Telegram</label>
                <input
                  name="telegram"
                  value={formData.telegram || ''}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00E272]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Funding</label>
              <input
                name="funding"
                value={formData.funding || ''}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00E272]"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00E272] hover:bg-[#00c965] text-black font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Post Airdrop'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
