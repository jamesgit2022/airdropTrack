import React, { useEffect } from 'react';
import { TrendingUp, Calendar, StickyNote, Clock, Users, TestTube, Rocket } from 'lucide-react';
import { ActiveTab } from '../types/Task';
import { formatTime } from '../utils/dateUtils';
import { motion, useSpring, useTransform } from 'framer-motion';
import { clsx } from 'clsx';

interface StatsProps {
  activeTab: ActiveTab;
  dailyCompletionRate: number;
  noteCompletionRate: number;
  waitlistCompletionRate: number;
  testnetCompletionRate: number;
  dailyStreak: number;
  noteStreak: number;
  waitlistStreak: number;
  testnetStreak: number;
  timeUntilReset: number;
}

const Counter = ({ value, suffix = '' }: { value: number, suffix?: string }) => {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current) + suffix);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
};

export const Stats: React.FC<StatsProps> = ({
  activeTab,
  dailyCompletionRate,
  noteCompletionRate,
  waitlistCompletionRate,
  testnetCompletionRate,
  dailyStreak,
  noteStreak,
  waitlistStreak,
  testnetStreak,
  timeUntilReset
}) => {
  const getCurrentCompletionRate = () => {
    switch (activeTab) {
      case 'daily': return dailyCompletionRate;
      case 'note': return noteCompletionRate;
      case 'waitlist': return waitlistCompletionRate;
      case 'testnet': return testnetCompletionRate;
      default: return 0;
    }
  };

  const getCurrentStreak = () => {
    switch (activeTab) {
      case 'daily': return dailyStreak;
      case 'note': return noteStreak;
      case 'waitlist': return waitlistStreak;
      case 'testnet': return testnetStreak;
      default: return 0;
    }
  };

  const getTabInfo = () => {
    switch (activeTab) {
      case 'daily': 
        return { icon: Calendar, label: 'Daily', color: 'text-blue-400', bg: 'bg-blue-900/20' };
      case 'note': 
        return { icon: StickyNote, label: 'Task Only', color: 'text-teal-400', bg: 'bg-teal-900/20' };
      case 'waitlist': 
        return { icon: Users, label: 'Waitlist', color: 'text-orange-400', bg: 'bg-orange-900/20' };
      case 'testnet': 
        return { icon: TestTube, label: 'Testnet', color: 'text-green-400', bg: 'bg-green-900/20' };
      case 'airdrop':
        return { icon: Rocket, label: 'Airdrop', color: 'text-[#00E272]', bg: 'bg-[#00E272]/20' };
      default: 
        return { icon: Calendar, label: 'Unknown', color: 'text-gray-400', bg: 'bg-gray-900/20' };
    }
  };

  const currentCompletionRate = getCurrentCompletionRate();
  const currentStreak = getCurrentStreak();
  const tabInfo = getTabInfo();
  const TabIcon = tabInfo.icon;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    hover: { y: -5, transition: { duration: 0.2 } }
  };

  // Don't show stats for Airdrop tab for now as it has its own stats
  if (activeTab === 'airdrop') return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <motion.div 
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="bg-[#1A1B1E] p-5 rounded-2xl border border-gray-800 shadow-sm hover:shadow-md hover:border-[#00E272]/30 transition-all"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-[#00E272]/20 rounded-lg">
            <TrendingUp className="w-5 h-5 text-[#00E272]" />
          </div>
          <span className="font-medium text-gray-300">Completion Rate</span>
        </div>
        <div className="text-3xl font-bold text-[#00E272] flex items-end gap-1">
          <Counter value={currentCompletionRate} suffix="%" />
        </div>
        <div className="mt-2 w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${currentCompletionRate}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-[#00E272] rounded-full"
          />
        </div>
      </motion.div>

      <motion.div 
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        transition={{ delay: 0.1 }}
        className="bg-[#1A1B1E] p-5 rounded-2xl border border-gray-800 shadow-sm hover:shadow-md hover:border-[#00E272]/30 transition-all"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className={clsx("p-2 rounded-lg", tabInfo.bg)}>
            <TabIcon className={clsx("w-5 h-5", tabInfo.color)} />
          </div>
          <span className="font-medium text-gray-300">
            {tabInfo.label} Streak
          </span>
        </div>
        <div className={clsx("text-3xl font-bold", tabInfo.color)}>
          <Counter value={currentStreak} />
        </div>
      </motion.div>

      {activeTab === 'daily' && (
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          transition={{ delay: 0.2 }}
          className="bg-[#1A1B1E] p-5 rounded-2xl border border-gray-800 shadow-sm hover:shadow-md hover:border-[#00E272]/30 transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-900/20 rounded-lg">
              <Clock className="w-5 h-5 text-orange-400" />
            </div>
            <span className="font-medium text-gray-300">Daily Reset</span>
          </div>
          <div className="text-2xl font-bold text-orange-400 font-mono tracking-tight">
            {formatTime(timeUntilReset)}
          </div>
        </motion.div>
      )}
    </div>
  );
};
