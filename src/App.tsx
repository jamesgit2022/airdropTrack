import { ConfirmationModal } from './components/ConfirmationModal';
import { TaskCompletionModal } from './components/TaskCompletionModal';
import { SettingsModal } from './components/SettingsModal';
import { ProfileModal } from './components/ProfileModal';
import { Sidebar } from './components/Sidebar';
import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import { useTasks } from './hooks/useTasks';
import { Auth } from './components/Auth';
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import { TaskInputModal } from './components/TaskInputModal';
import { SearchAndSort } from './components/SearchAndSort';
import { TaskList } from './components/TaskList';
import { Stats } from './components/Stats';
import { motion } from 'framer-motion';

function AppContent() {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const {
    // State
    tasks,
    activeTab,
    newTask,
    newTaskType,
    newTaskStatus,
    newTaskLink,
    newTaskWebsite,
    newTaskTwitter,
    newTaskDiscord,
    newTaskTelegram,
    newTaskDescription,
    showTaskInput,
    showSettingsModal,
    showDeleteModal,
    showConfirmCompleteModal,
    editingTask,
    editingTaskData,
    timeUntilReset,
    customResetTime,
    searchQuery,
    sortOption,
    taskToConfirmComplete,
    
    // Computed values
    dailyTasks,
    noteTasks,
    waitlistTasks,
    testnetTasks,
    dailyCompletionRate,
    noteCompletionRate,
    waitlistCompletionRate,
    testnetCompletionRate,
    dailyStreak,
    noteStreak,
    waitlistStreak,
    testnetStreak,
    
    // Actions
    setActiveTab,
    setNewTask,
    setNewTaskType,
    setNewTaskStatus,
    setNewTaskLink,
    setNewTaskWebsite,
    setNewTaskTwitter,
    setNewTaskDiscord,
    setNewTaskTelegram,
    setNewTaskDescription,
    setShowTaskInput,
    setShowDeleteModal,
    setShowSettingsModal,
    setEditingTaskData,
    setSearchQuery,
    setSortOption,
    resetDailyTasks,
    saveResetTime,
    exportTasksData,
    importTasksData,
    addTask,
    toggleTask,
    deleteTask,
    confirmDelete,
    startEditing,
    saveEdit,
    cancelEdit,
    requestConfirmComplete,
    confirmCompleteTask,
    cancelConfirmComplete
  } = useTasks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-gray-900 dark:to-gray-950 transition-colors duration-200">
      {/* Sidebar for Desktop */}
      <Sidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        dailyCount={dailyTasks.length}
        noteCount={noteTasks.length}
        waitlistCount={waitlistTasks.length}
        testnetCount={testnetTasks.length}
      />

      {/* Main Content Area - Responsive Margin */}
      <div className="md:ml-64 min-h-screen transition-all duration-300">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          
          {/* Mobile Header - Hidden on Desktop */}
          <div className="md:hidden">
            <Header 
              onOpenSettings={() => setShowSettingsModal(true)}
              onOpenProfile={() => setShowProfileModal(true)}
              dailyCompletionRate={dailyCompletionRate}
              dailyStreak={dailyStreak}
              timeUntilReset={timeUntilReset}
            />
            
            <TabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              dailyCount={dailyTasks.length}
              noteCount={noteTasks.length}
              waitlistCount={waitlistTasks.length}
              testnetCount={testnetTasks.length}
            />
          </div>
          
          {/* Stats - Always visible now, grid adjusts automatically */}
          <div className="mb-8">
            <Stats
              activeTab={activeTab}
              dailyCompletionRate={dailyCompletionRate}
              noteCompletionRate={noteCompletionRate}
              waitlistCompletionRate={waitlistCompletionRate}
              testnetCompletionRate={testnetCompletionRate}
              dailyStreak={dailyStreak}
              noteStreak={noteStreak}
              waitlistStreak={waitlistStreak}
              testnetStreak={testnetStreak}
              timeUntilReset={timeUntilReset}
            />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowTaskInput(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all font-medium"
            >
              <Plus className="w-5 h-5" />
              Add New Task
            </motion.button>

            <div className="w-full md:w-auto">
              <SearchAndSort
                searchQuery={searchQuery}
                sortOption={sortOption}
                onSearchChange={setSearchQuery}
                onSortChange={setSortOption}
              />
            </div>
          </div>
          
          <TaskList
            tasks={tasks}
            activeTab={activeTab}
            editingTask={editingTask}
            editingTaskData={editingTaskData}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onStartEditing={startEditing}
            onSaveEdit={saveEdit}
            onCancelEdit={cancelEdit}
            onEditingTaskDataChange={setEditingTaskData}
            onRequestConfirmComplete={requestConfirmComplete}
          />
          
          <TaskInputModal
            isOpen={showTaskInput}
            onClose={() => setShowTaskInput(false)}
            newTask={newTask}
            newTaskType={newTaskType}
            newTaskStatus={newTaskStatus}
            newTaskLink={newTaskLink}
            newTaskWebsite={newTaskWebsite}
            newTaskTwitter={newTaskTwitter}
            newTaskDiscord={newTaskDiscord}
            newTaskTelegram={newTaskTelegram}
            newTaskDescription={newTaskDescription}
            onTaskChange={setNewTask}
            onTaskTypeChange={setNewTaskType}
            onTaskStatusChange={setNewTaskStatus}
            onTaskLinkChange={setNewTaskLink}
            onTaskWebsiteChange={setNewTaskWebsite}
            onTaskTwitterChange={setNewTaskTwitter}
            onTaskDiscordChange={setNewTaskDiscord}
            onTaskTelegramChange={setNewTaskTelegram}
            onTaskDescriptionChange={setNewTaskDescription}
            onAddTask={addTask}
          />
          
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
          
          <ConfirmationModal
            isOpen={showDeleteModal}
            title="Delete Task"
            message="Are you sure you want to delete this task? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={confirmDelete}
            onCancel={() => setShowDeleteModal(false)}
            variant="danger"
          />
          
          <TaskCompletionModal
            isOpen={showConfirmCompleteModal}
            task={taskToConfirmComplete}
            onConfirm={confirmCompleteTask}
            onCancel={cancelConfirmComplete}
          />
        </div>
      </div>
    </div>
  );
}

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return <AppContent />;
}

export default App;
