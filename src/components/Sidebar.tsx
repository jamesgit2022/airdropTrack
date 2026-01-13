import React, { useState, useEffect } from 'react';
import { Calendar, StickyNote, Users, TestTube, Settings, User, LogOut, Sparkles, Rocket, ChevronDown, ChevronRight, Target, LogIn, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActiveTab } from '../types/Task';
import { useAuth } from '../contexts/AuthContext';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  dailyCount: number;
  noteCount: number;
  waitlistCount: number;
  testnetCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenSettings,
  onOpenProfile,
  dailyCount,
  noteCount,
  waitlistCount,
  testnetCount,
  isCollapsed,
  onToggleCollapse
}) => {
  const { user, signOut } = useAuth();
  
  // Initialize open state based on whether active tab is in the tracker group
  const isTrackerTab = ['daily', 'note', 'waitlist', 'testnet'].includes(activeTab);
  const [isTrackerOpen, setIsTrackerOpen] = useState(isTrackerTab);

  // Sync open state when active tab changes externally (e.g. navigation)
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

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="hidden md:flex flex-col h-screen fixed left-0 top-0 bg-[#1A1B1E] border-r border-gray-800 z-50 overflow-hidden"
    >
      {/* Logo Area */}
      <div className={clsx("p-6 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00E272]/20 rounded-xl flex items-center justify-center border border-[#00E272]/30 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[#00E272]" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="text-xl font-bold text-white whitespace-nowrap">
                Airdrop
              </h1>
              <p className="text-xs text-[#00E272] font-medium tracking-wide whitespace-nowrap">TRACKER APP</p>
            </motion.div>
          )}
        </div>
        
        {/* Toggle Button (Only visible when expanded, or we can make it absolute) */}
      </div>

      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-10 w-6 h-6 bg-[#1A1B1E] border border-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white z-50 shadow-md"
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Navigation */}
      <nav className="space-y-2 px-3 mt-4">
        {/* Airdrop Item (Standalone) */}
        <Link
          to={getPath('airdrop')}
          className={clsx(
            "w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative",
            isCollapsed ? "justify-center" : "justify-start",
            activeTab === 'airdrop'
              ? "bg-[#00E272]/10 text-[#00E272]" 
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          )}
          title={isCollapsed ? "Airdrop 2026" : undefined}
        >
          {activeTab === 'airdrop' && (
            <motion.div
              layoutId="activeTab"
              className="absolute left-0 w-1 h-8 bg-[#00E272] rounded-r-full"
            />
          )}
          <div className="flex items-center gap-3">
            <Rocket className={clsx("w-5 h-5 flex-shrink-0", activeTab === 'airdrop' ? "text-[#00E272]" : "text-gray-500 group-hover:text-white")} />
            {!isCollapsed && <span className="font-medium whitespace-nowrap">Airdrop 2026</span>}
          </div>
        </Link>

        {/* Tracker Group */}
        <div>
          <button
            onClick={() => setIsTrackerOpen(!isTrackerOpen)}
            className={clsx(
              "w-full flex items-center p-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-200",
              isCollapsed ? "justify-center" : "justify-between"
            )}
            title={isCollapsed ? "Tracker" : undefined}
          >
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-gray-500 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium whitespace-nowrap">Tracker</span>}
            </div>
            {!isCollapsed && (
              isTrackerOpen ? <ChevronDown className="w-4 h-4 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 flex-shrink-0" />
            )}
          </button>

          <AnimatePresence>
            {(isTrackerOpen || isCollapsed) && (
              <motion.div
                initial={!isCollapsed ? { height: 0, opacity: 0 } : false}
                animate={!isCollapsed ? { height: 'auto', opacity: 1 } : { opacity: 1 }}
                exit={!isCollapsed ? { height: 0, opacity: 0 } : false}
                className="overflow-hidden"
              >
                <div className={clsx("space-y-1 mt-1", !isCollapsed && "pl-4")}> 
                  {trackerItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    
                    return (
                      <Link
                        key={item.id}
                        to={getPath(item.id)}
                        className={clsx(
                          "w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative",
                          isCollapsed ? "justify-center" : "justify-between",
                          isActive 
                            ? "bg-[#00E272]/10 text-[#00E272]" 
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        )}
                        title={isCollapsed ? item.label : undefined}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute left-0 w-1 h-8 bg-[#00E272] rounded-r-full"
                          />
                        )}
                        <div className="flex items-center gap-3">
                          <Icon className={clsx("w-5 h-5 flex-shrink-0", isActive ? "text-[#00E272]" : "text-gray-500 group-hover:text-white")} />
                          {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
                        </div>
                        {!isCollapsed && item.count > 0 && (
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

      {/* Bottom Actions */}
      <div className="mt-auto p-6 border-t border-gray-800 space-y-2">
        {user ? (
          <>
            <button
              onClick={onOpenProfile}
              className={clsx(
                "w-full flex items-center p-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors",
                isCollapsed ? "justify-center" : "justify-start gap-3"
              )}
              title={isCollapsed ? "Profile" : undefined}
            >
              <User className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium whitespace-nowrap">Profile</span>}
            </button>
            
            <button
              onClick={onOpenSettings}
              className={clsx(
                "w-full flex items-center p-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors",
                isCollapsed ? "justify-center" : "justify-start gap-3"
              )}
              title={isCollapsed ? "Settings" : undefined}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium whitespace-nowrap">Settings</span>}
            </button>

            <button
              onClick={() => signOut()}
              className={clsx(
                "w-full flex items-center p-3 rounded-xl text-red-400 hover:bg-red-900/20 transition-colors mt-4",
                isCollapsed ? "justify-center" : "justify-start gap-3"
              )}
              title={isCollapsed ? "Sign Out" : undefined}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium whitespace-nowrap">Sign Out</span>}
            </button>
          </>
        ) : (
          <Link
            to="/dailytasks" 
            className={clsx(
              "w-full flex items-center p-3 rounded-xl text-[#00E272] bg-[#00E272]/10 hover:bg-[#00E272]/20 transition-colors mt-4",
              isCollapsed ? "justify-center" : "justify-start gap-3"
            )}
            title={isCollapsed ? "Sign In" : undefined}
          >
            <LogIn className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium whitespace-nowrap">Sign In</span>}
          </Link>
        )}
      </div>
    </motion.div>
  );
};
