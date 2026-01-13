import { ConfirmationModal } from './components/ConfirmationModal';
import { TaskCompletionModal } from './components/TaskCompletionModal';
import { SettingsModal } from './components/SettingsModal';
import { ProfileModal } from './components/ProfileModal';
import { Sidebar } from './components/Sidebar';
import { MobileSidebar } from './components/MobileSidebar';
import { useState, useEffect } from 'react';
import { Loader2, Menu, Sparkles } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import { useTasks } from './hooks/useTasks';
import { Auth } from './components/Auth';
import { Background } from './components/Background';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TaskPage } from './components/TaskPage';
import { AirdropList } from './components/Airdrops/AirdropList';
import { AirdropDetailsWrapper } from './components/Airdrops/AirdropDetailsWrapper';
import { ProtectedRoute } from './components/ProtectedRoute';

function AppContent() {
  const { theme } = useTheme();
  const { user } = useAuth(); 
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const taskData = useTasks();
  const {
    activeTab,
    setActiveTab,
    showSettingsModal,
    setShowSettingsModal,
    saveResetTime,
    customResetTime,
    exportTasksData,
    importTasksData,
    tasks
  } = taskData;

  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/airdrop2026')) {
      if (activeTab !== 'airdrop') setActiveTab('airdrop');
    } else if (path === '/dailytasks') {
      if (activeTab !== 'daily') setActiveTab('daily');
    } else if (path === '/notes') {
      if (activeTab !== 'note') setActiveTab('note');
    } else if (path === '/waitlist') {
      if (activeTab !== 'waitlist') setActiveTab('waitlist');
    } else if (path === '/testnet') {
      if (activeTab !== 'testnet') setActiveTab('testnet');
    }
  }, [location, setActiveTab, activeTab]);

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-200">
      <Background />
      <div className="relative z-10">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-[#1A1B1E]/80 backdrop-blur-sm sticky top-0 z-40">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#00E272]/20 rounded-lg flex items-center justify-center border border-[#00E272]/30">
                <Sparkles className="w-4 h-4 text-[#00E272]" />
              </div>
              <span className="font-bold text-white">Airdrop Tracker</span>
           </div>
           <button 
             onClick={() => setIsMobileSidebarOpen(true)}
             className="p-2 text-gray-400 hover:text-white"
           >
             <Menu className="w-6 h-6" />
           </button>
        </div>

        {/* Sidebar for Desktop */}
        <Sidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenSettings={() => setShowSettingsModal(true)}
          onOpenProfile={() => setShowProfileModal(true)}
          dailyCount={taskData.dailyTasks.length}
          noteCount={taskData.noteTasks.length}
          waitlistCount={taskData.waitlistTasks.length}
          testnetCount={taskData.testnetTasks.length}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Mobile Sidebar Drawer */}
        <MobileSidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenSettings={() => setShowSettingsModal(true)}
          onOpenProfile={() => setShowProfileModal(true)}
          dailyCount={taskData.dailyTasks.length}
          noteCount={taskData.noteTasks.length}
          waitlistCount={taskData.waitlistTasks.length}
          testnetCount={taskData.testnetTasks.length}
        />

        <div className={`min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
           <Routes>
              <Route path="/" element={<Navigate to="/airdrop2026" replace />} />
              
              <Route path="/dailytasks" element={
                <ProtectedRoute>
                  <TaskPage 
                    taskData={taskData} 
                    activeTab="daily"
                    onOpenSettings={() => setShowSettingsModal(true)}
                    onOpenProfile={() => setShowProfileModal(true)}
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/notes" element={
                <ProtectedRoute>
                  <TaskPage 
                    taskData={taskData} 
                    activeTab="note"
                    onOpenSettings={() => setShowSettingsModal(true)}
                    onOpenProfile={() => setShowProfileModal(true)}
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/waitlist" element={
                <ProtectedRoute>
                  <TaskPage 
                    taskData={taskData} 
                    activeTab="waitlist"
                    onOpenSettings={() => setShowSettingsModal(true)}
                    onOpenProfile={() => setShowProfileModal(true)}
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/testnet" element={
                <ProtectedRoute>
                  <TaskPage 
                    taskData={taskData} 
                    activeTab="testnet"
                    onOpenSettings={() => setShowSettingsModal(true)}
                    onOpenProfile={() => setShowProfileModal(true)}
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/airdrop2026" element={<AirdropList />} />
              <Route path="/airdrop2026/:id" element={<AirdropDetailsWrapper />} />
           </Routes>
        </div>
      </div>

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        theme={theme}
        currentResetHour={customResetTime.hour}
        currentResetMinute={customResetTime.minute}
        onSaveResetTime={saveResetTime}
        onExportData={exportTasksData}
        onImportData={importTasksData}
      />

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        tasks={tasks}
      />
    </div>
  );
}

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  // Removed the global user check to allow public access
  return <AppContent />;
}

export default App;
