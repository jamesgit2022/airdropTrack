import React from 'react';
import { Calendar, StickyNote, Users, TestTube, Settings, User, LogOut, CheckSquare, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { ActiveTab } from '../types/Task';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  dailyCount: number;
  noteCount: number;
  waitlistCount: number;
  testnetCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenSettings,
  onOpenProfile,
  dailyCount,
  noteCount,
  waitlistCount,
  testnetCount
}) => {
  const { signOut } = useAuth();

  const menuItems = [
    { id: 'daily', label: 'Daily Tasks', icon: Calendar, count: dailyCount, color: 'text-blue-500' },
    { id: 'note', label: 'Task Only', icon: StickyNote, count: noteCount, color: 'text-teal-500' },
    { id: 'waitlist', label: 'Waitlist', icon: Users, count: waitlistCount, color: 'text-orange-500' },
    { id: 'testnet', label: 'Testnet', icon: TestTube, count: testnetCount, color: 'text-green-500' },
  ];

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 z-50"
    >
      {/* Logo Area */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400">
              Airdrop
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide">TRACKER APP</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as ActiveTab)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-8 bg-teal-600 rounded-r-full"
                  />
                )}
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                    isActive 
                      ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto p-6 border-t border-gray-200 dark:border-gray-800 space-y-2">
        <button
          onClick={onOpenProfile}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="font-medium">Profile</span>
        </button>
        
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>

        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-4"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </motion.div>
  );
};
