import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Stats } from './Stats';
import { SearchAndSort } from './SearchAndSort';
import { TaskList } from './TaskList';
import { TaskInputModal } from './TaskInputModal';
import { ConfirmationModal } from './ConfirmationModal';
import { TaskCompletionModal } from './TaskCompletionModal';
import { useTasks } from '../hooks/useTasks';
import { ActiveTab } from '../types/Task';

interface TaskPageProps {
  taskData: ReturnType<typeof useTasks>;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  activeTab: ActiveTab;
}

export const TaskPage: React.FC<TaskPageProps> = ({
  taskData,
  onOpenSettings,
  onOpenProfile,
  activeTab
}) => {
  const {
    // State
    tasks,
    // activeTab is passed as prop now, though taskData has it too. 
    // We should rely on the prop for UI, but taskData for actions if needed.
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
    showDeleteModal,
    showConfirmCompleteModal,
    editingTask,
    editingTaskData,
    timeUntilReset,
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
    setActiveTab, // We might need to call this to sync state if we click tabs here
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
    setEditingTaskData,
    setSearchQuery,
    setSortOption,
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
  } = taskData;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      
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
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#00E272] text-black rounded-xl hover:bg-[#00c965] hover:shadow-lg hover:shadow-[#00E272]/20 transition-all font-bold"
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
  );
};
