import React from 'react';
import { TaskInputForm } from './TaskInputForm';
import { TaskType, TaskStatus } from '../types/Task';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  newTask: string;
  newTaskType: TaskType;
  newTaskStatus: TaskStatus;
  newTaskLink: string;
  newTaskWebsite: string;
  newTaskTwitter: string;
  newTaskDiscord: string;
  newTaskTelegram: string;
  newTaskDescription: string;
  onTaskChange: (value: string) => void;
  onTaskTypeChange: (type: TaskType) => void;
  onTaskStatusChange: (status: TaskStatus) => void;
  onTaskLinkChange: (value: string) => void;
  onTaskWebsiteChange: (value: string) => void;
  onTaskTwitterChange: (value: string) => void;
  onTaskDiscordChange: (value: string) => void;
  onTaskTelegramChange: (value: string) => void;
  onTaskDescriptionChange: (value: string) => void;
  onAddTask: () => void;
}

export const TaskInputModal: React.FC<TaskInputModalProps> = ({
  isOpen,
  onClose,
  newTask,
  newTaskType,
  newTaskStatus,
  newTaskLink,
  newTaskWebsite,
  newTaskTwitter,
  newTaskDiscord,
  newTaskTelegram,
  newTaskDescription,
  onTaskChange,
  onTaskTypeChange,
  onTaskStatusChange,
  onTaskLinkChange,
  onTaskWebsiteChange,
  onTaskTwitterChange,
  onTaskDiscordChange,
  onTaskTelegramChange,
  onTaskDescriptionChange,
  onAddTask,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-gray-700"
          >
            <TaskInputForm
              newTask={newTask}
              newTaskType={newTaskType}
              newTaskStatus={newTaskStatus}
              newTaskLink={newTaskLink}
              newTaskWebsite={newTaskWebsite}
              newTaskTwitter={newTaskTwitter}
              newTaskDiscord={newTaskDiscord}
              newTaskTelegram={newTaskTelegram}
              newTaskDescription={newTaskDescription}
              onTaskChange={onTaskChange}
              onTaskTypeChange={onTaskTypeChange}
              onTaskStatusChange={onTaskStatusChange}
              onTaskLinkChange={onTaskLinkChange}
              onTaskWebsiteChange={onTaskWebsiteChange}
              onTaskTwitterChange={onTaskTwitterChange}
              onTaskDiscordChange={onTaskDiscordChange}
              onTaskTelegramChange={onTaskTelegramChange}
              onTaskDescriptionChange={onTaskDescriptionChange}
              onAddTask={onAddTask}
              onClose={onClose}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
