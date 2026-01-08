import React from 'react';
import { MobileNavbar } from './MobileNavbar';
import { motion } from 'framer-motion';
import { Sparkles, CheckSquare, User, Settings } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  dailyCompletionRate: number;
  dailyStreak: number;
  timeUntilReset: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenSettings,
  onOpenProfile, 
  dailyCompletionRate, 
  dailyStreak, 
  timeUntilReset 
}) => {
  return (
    <>
      {/* Mobile Navbar - Only visible on mobile */}
      <MobileNavbar 
        onOpenSettings={onOpenSettings}
        dailyCompletionRate={dailyCompletionRate}
        dailyStreak={dailyStreak}
        timeUntilReset={timeUntilReset}
      />
      
      {/* Mobile Header Top Bar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="md:hidden flex items-center justify-between mb-6 pt-2"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400">
            Airdrop Tracker
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
           <button
            onClick={onOpenProfile}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <User className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </>
  );
};
