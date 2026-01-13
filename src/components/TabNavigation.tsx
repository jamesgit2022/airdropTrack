import React from 'react';
import { Calendar, StickyNote, Users, TestTube, Rocket } from 'lucide-react';
import { ActiveTab } from '../types/Task';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

interface TabNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  dailyCount: number;
  noteCount: number;
  waitlistCount: number;
  testnetCount: number;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange, // kept for interface compat but unused
  dailyCount,
  noteCount,
  waitlistCount,
  testnetCount
}) => {
  const tabs = [
    { id: 'airdrop', label: 'Airdrop 2026', icon: Rocket, count: 0, fullWidth: true },
    { id: 'daily', label: 'Daily', icon: Calendar, count: dailyCount },
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

  return (
    <div className="grid grid-cols-2 bg-[#1A1B1E] rounded-lg p-1 mb-6 gap-1 md:hidden border border-gray-800">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <Link
            key={tab.id}
            to={getPath(tab.id)}
            className={clsx(
              "flex items-center justify-center gap-2 py-3 px-2 rounded-md font-medium transition-all text-sm",
              tab.fullWidth && "col-span-2",
              isActive
                ? "bg-[#00E272]/10 text-[#00E272] shadow-sm border border-[#00E272]/20"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="inline">{tab.label}</span>
            {tab.count > 0 && (
              <span className={clsx(
                "text-xs px-2 py-1 rounded-full",
                isActive ? "bg-[#00E272]/20 text-[#00E272]" : "bg-gray-800 text-gray-500"
              )}>
                {tab.count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
};
