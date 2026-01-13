import React, { useState, useEffect } from 'react';
import { Calendar, StickyNote, Users, TestTube, Settings, User, LogOut, Sparkles, Rocket, ChevronDown, ChevronRight, Target, LogIn, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActiveTab } from '../types/Task';
import { useAuth } from '../contexts/AuthContext';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  dailyCount: number;
  noteCount: number;
  waitlistCount: number;
  testnetCount: number;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  onOpenSettings,
  onOpenProfile,
  dailyCount,
  noteCount,
  waitlistCount,
  testnetCount
}) => {
  const { user, signOut } = useAuth();
  
  const isTrackerTab = ['daily', 'note', 'waitlist', 'testnet'].includes(activeTab);
  const [isTrackerOpen, setIsTrackerOpen] = useState(isTrackerTab);

  useEffect(() => {
    if (['daily', 'note', 'waitlist', 'testnet'].includes(activeTab)) {
      setIsTrackerOpen(true);
    }
  }, [activeTab]);

  const trackerItems = [
    { id: 'daily', label: 'Daily Tasks', icon: Calendar, count: dailyCount },
    { id: 'note', label: 'Task Only', icon: StickyNote, count: noteCount },
    { id: 'waitlist', label: 'Waitlist', icon: Users, count: waitlistCount },
    { id: 'testnet', label: 'Testnet', icon: TestTube, count: testnetCount },
  ];

  const getPath = (id: string) => {
    switch (id) {
      case 'airdrop': return '/airdrop2026';
      case 'daily': return '/dailytasks';
      case 'note': return '/notes';
      case 'waitlist': return '/waitlist';
      case 'testnet': return '/testnet';
      default: return '/dailytasks';
    }
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
          />

          {/* Sidebar Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-[80%] max-w-xs bg-[#1A1B1E] border-r border-gray-800 z-50 md:hidden flex flex-col overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00E272]/20 rounded-xl flex items-center justify-center border border-[#00E272]/30">
                  <Sparkles className="w-5 h-5 text-[#00E272]" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Airdrop</h1>
                  <p className="text-xs text-[#00E272] font-medium tracking-wide">TRACKER APP</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2 flex-1">
              <Link
                to={getPath('airdrop')}
                onClick={handleLinkClick}
                className={clsx(
                  "w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative",
                  activeTab === 'airdrop'
                    ? "bg-[#00E272]/10 text-[#00E272]" 
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                )}
              >
                {activeTab === 'airdrop' && (
                  <div className="absolute left-0 w-1 h-8 bg-[#00E272] rounded-r-full" />
                )}
                <div className="flex items-center gap-3">
                  <Rocket className={clsx("w-5 h-5", activeTab === 'airdrop' ? "text-[#00E272]" : "text-gray-500 group-hover:text-white")} />
                  <span className="font-medium">Airdrop 2026</span>
                </div>
              </Link>

              <div>
                <button
                  onClick={() => setIsTrackerOpen(!isTrackerOpen)}
                  className="w-full flex items-center justify-between p-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Tracker</span>
                  </div>
                  {isTrackerOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                <AnimatePresence>
                  {isTrackerOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-1 mt-1 pl-4">
                        {trackerItems.map((item) => {
                          const Icon = item.icon;
                          const isActive = activeTab === item.id;
                          return (
                            <Link
                              key={item.id}
                              to={getPath(item.id)}
                              onClick={handleLinkClick}
                              className={clsx(
                                "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group relative",
                                isActive 
                                  ? "bg-[#00E272]/10 text-[#00E272]" 
                                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
                              )}
                            >
                              {isActive && (
                                <div className="absolute left-0 w-1 h-8 bg-[#00E272] rounded-r-full" />
                              )}
                              <div className="flex items-center gap-3">
                                <Icon className={clsx("w-5 h-5", isActive ? "text-[#00E272]" : "text-gray-500 group-hover:text-white")} />
                                <span className="font-medium">{item.label}</span>
                              </div>
                              {item.count > 0 && (
                                <span className={clsx(
                                  "text-xs font-semibold px-2 py-0.5 rounded-md",
                                  isActive 
                                  ? "bg-[#00E272]/20 text-[#00E272]" 
                                  : "bg-gray-800 text-gray-500"
                                )}>
                                  {item.count}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-800 space-y-2">
              {user ? (
                <>
                  <button
                    onClick={() => { onOpenProfile(); onClose(); }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Profile</span>
                  </button>
                  
                  <button
                    onClick={() => { onOpenSettings(); onClose(); }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                  </button>

                  <button
                    onClick={() => { signOut(); onClose(); }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-900/20 transition-colors mt-4"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/dailytasks"
                  onClick={onClose}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-[#00E272] bg-[#00E272]/10 hover:bg-[#00E272]/20 transition-colors mt-4"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="font-medium">Sign In</span>
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
