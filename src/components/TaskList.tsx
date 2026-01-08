import React from 'react';
import { Calendar, StickyNote, Users, TestTube, Sparkles } from 'lucide-react';
import { Task, ActiveTab, EditingTaskData } from '../types/Task';
import { TaskItem } from './TaskItem';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskListProps {
  tasks: Task[];
  activeTab: ActiveTab;
  editingTask: string | null;
  editingTaskData: EditingTaskData;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onStartEditing: (id: string, taskData: EditingTaskData) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditingTaskDataChange: (data: EditingTaskData) => void;
  onRequestConfirmComplete: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  activeTab,
  editingTask,
  editingTaskData,
  onToggleTask,
  onDeleteTask,
  onStartEditing,
  onSaveEdit,
  onCancelEdit,
  onEditingTaskDataChange,
  onRequestConfirmComplete
}) => {
  const getTabInfo = (tab: ActiveTab) => {
    switch (tab) {
      case 'daily':
        return { icon: Calendar, label: 'daily' };
      case 'note':
        return { icon: StickyNote, label: 'task only' };
      case 'waitlist':
        return { icon: Users, label: 'waitlist' };
      case 'testnet':
        return { icon: TestTube, label: 'testnet' };
      default:
        return { icon: Calendar, label: 'unknown' };
    }
  };

  if (tasks.length === 0) {
    const tabInfo = getTabInfo(activeTab);
    const TabIcon = tabInfo.icon;
    
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16 dark:text-gray-300"
      >
        <motion.div 
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center shadow-inner"
        >
          <TabIcon className="w-10 h-10 text-slate-400 dark:text-slate-500" />
        </motion.div>
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">
          No {tabInfo.label} tasks found
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Add your first {tabInfo.label} task to get started and boost your productivity!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      layout
      className="space-y-3"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isEditing={editingTask === task.id}
            editingTaskData={editingTaskData}
            onToggle={onToggleTask}
            onDelete={onDeleteTask}
            onStartEdit={onStartEditing}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
            onEditingTaskDataChange={onEditingTaskDataChange}
            onRequestConfirmComplete={onRequestConfirmComplete}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
