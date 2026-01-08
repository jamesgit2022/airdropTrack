import React, { useState } from 'react';
import { Check, Edit2, Trash2, Calendar, StickyNote, X, Save, Globe, FileText, Eye, Clock, Users, TestTube, Twitter, MessageCircle, Send } from 'lucide-react';
import { Task, TaskType, TaskStatus, EditingTaskData } from '../types/Task';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TaskItemProps {
  task: Task;
  isEditing: boolean;
  editingTaskData: EditingTaskData;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStartEdit: (id: string, taskData: EditingTaskData) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditingTaskDataChange: (data: EditingTaskData) => void;
  onRequestConfirmComplete: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isEditing,
  editingTaskData,
  onToggle,
  onDelete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditingTaskDataChange,
  onRequestConfirmComplete
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveEdit();
  };

  const handleToggleClick = () => {
    if (task.type === TaskType.DAILY && !task.completed) {
      onRequestConfirmComplete(task);
    } else if (task.type === TaskType.NOTE) {
      onToggle(task.id);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatLink = (link: string) => {
    if (!link) return '';
    return link.startsWith('http') ? link : `https://${link}`;
  };

  const isValidUrl = (url: string) => {
    if (!url.trim()) return true;
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const getTaskTypeInfo = (type: TaskType) => {
    switch (type) {
      case TaskType.DAILY:
        return { icon: Calendar, label: 'Daily', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' };
      case TaskType.NOTE:
        return { icon: StickyNote, label: 'Task Only', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400' };
      case TaskType.WAITLIST:
        return { icon: Users, label: 'Waitlist', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400' };
      case TaskType.TESTNET:
        return { icon: TestTube, label: 'Testnet', color: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400' };
      default:
        return { icon: Calendar, label: 'Unknown', color: 'bg-gray-100 text-gray-600 dark:bg-gray-900/40 dark:text-gray-400' };
    }
  };

  const getStatusInfo = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.EARLY:
        return { label: 'Early', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' };
      case TaskStatus.ONGOING:
        return { label: 'Ongoing', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' };
      case TaskStatus.ENDED:
        return { label: 'Ended', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300' };
      default:
        return { label: 'Unknown', color: 'bg-gray-100 text-gray-600 dark:bg-gray-900/40 dark:text-gray-400' };
    }
  };

  const canToggle = task.type === TaskType.NOTE || (task.type === TaskType.DAILY && !task.completed);
  const taskTypeInfo = getTaskTypeInfo(task.type);
  const statusInfo = getStatusInfo(task.status);
  const TaskTypeIcon = taskTypeInfo.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={twMerge(
        "group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg dark:hover:shadow-gray-900/50 hover:border-blue-200 dark:hover:border-gray-600",
        task.completed ? 'opacity-75 bg-gray-50 dark:bg-gray-800/50' : ''
      )}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleClick}
            disabled={!canToggle}
            className={twMerge(
              "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-1",
              task.completed
                ? 'bg-green-500 border-green-500 text-white shadow-md shadow-green-500/20'
                : canToggle
                ? 'border-gray-300 dark:border-gray-500 hover:border-green-500 dark:hover:border-green-400'
                : 'border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50'
            )}
          >
            {task.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Check className="w-3.5 h-3.5" />
              </motion.div>
            )}
          </motion.button>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <motion.form 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleEditSubmit} 
                className="space-y-3"
              >
                <input
                  type="text"
                  value={editingTaskData.text}
                  onChange={(e) => onEditingTaskDataChange({ ...editingTaskData, text: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="Task title"
                  required
                  autoFocus
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={editingTaskData.status}
                    onChange={(e) => onEditingTaskDataChange({ ...editingTaskData, status: e.target.value as TaskStatus })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value={TaskStatus.EARLY}>Early</option>
                    <option value={TaskStatus.ONGOING}>Ongoing</option>
                    <option value={TaskStatus.ENDED}>Ended</option>
                  </select>
                  
                  <input
                    type="url"
                    value={editingTaskData.website}
                    onChange={(e) => onEditingTaskDataChange({ ...editingTaskData, website: e.target.value })}
                    className={twMerge(
                      "w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all",
                      editingTaskData.website && !isValidUrl(editingTaskData.website)
                        ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'
                    )}
                    placeholder="Website Link (optional)"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="url"
                    value={editingTaskData.twitter}
                    onChange={(e) => onEditingTaskDataChange({ ...editingTaskData, twitter: e.target.value })}
                    className={twMerge(
                      "w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all",
                      editingTaskData.twitter && !isValidUrl(editingTaskData.twitter)
                        ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'
                    )}
                    placeholder="Twitter/X"
                  />
                  <input
                    type="url"
                    value={editingTaskData.discord}
                    onChange={(e) => onEditingTaskDataChange({ ...editingTaskData, discord: e.target.value })}
                    className={twMerge(
                      "w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all",
                      editingTaskData.discord && !isValidUrl(editingTaskData.discord)
                        ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'
                    )}
                    placeholder="Discord"
                  />
                  <input
                    type="url"
                    value={editingTaskData.telegram}
                    onChange={(e) => onEditingTaskDataChange({ ...editingTaskData, telegram: e.target.value })}
                    className={twMerge(
                      "w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all",
                      editingTaskData.telegram && !isValidUrl(editingTaskData.telegram)
                        ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'
                    )}
                    placeholder="Telegram"
                  />
                </div>
                
                <textarea
                  value={editingTaskData.description}
                  onChange={(e) => onEditingTaskDataChange({ ...editingTaskData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-vertical transition-all"
                  placeholder="Description (optional)"
                  rows={3}
                />
                
                <div className="flex gap-2 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={
                      !editingTaskData.text.trim() ||
                      (editingTaskData.website && !isValidUrl(editingTaskData.website)) ||
                      (editingTaskData.twitter && !isValidUrl(editingTaskData.twitter)) ||
                      (editingTaskData.discord && !isValidUrl(editingTaskData.discord)) ||
                      (editingTaskData.telegram && !isValidUrl(editingTaskData.telegram))
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={onCancelEdit}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              <div className="space-y-3">
                {/* Task Title and Type */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={twMerge(
                    "font-medium text-lg transition-all",
                    task.completed ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-800 dark:text-gray-100'
                  )}>
                    {task.text}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={twMerge("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-transparent", taskTypeInfo.color)}>
                      <TaskTypeIcon className="w-3.5 h-3.5" />
                      {taskTypeInfo.label}
                    </span>
                    <span className={twMerge("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-transparent", statusInfo.color)}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* Links Section */}
                {(task.website || task.link || task.twitter || task.discord || task.telegram) && (
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {(task.website || task.link) && (
                      <a
                        href={formatLink(task.website || task.link || '')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 text-xs font-medium transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        Website
                      </a>
                    )}
                    {task.twitter && (
                      <a
                        href={formatLink(task.twitter)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 dark:bg-sky-900/20 dark:text-sky-400 dark:hover:bg-sky-900/30 text-xs font-medium transition-colors"
                      >
                        <Twitter className="w-3.5 h-3.5" />
                        Twitter
                      </a>
                    )}
                    {task.discord && (
                      <a
                        href={formatLink(task.discord)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/30 text-xs font-medium transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Discord
                      </a>
                    )}
                    {task.telegram && (
                      <a
                        href={formatLink(task.telegram)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-50 text-cyan-600 hover:bg-cyan-100 dark:bg-cyan-900/20 dark:text-cyan-400 dark:hover:bg-cyan-900/30 text-xs font-medium transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Telegram
                      </a>
                    )}
                  </div>
                )}

                {/* Description */}
                {task.description && (
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 border border-gray-100 dark:border-gray-700/50">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</span>
                    </div>
                    <div className={twMerge(
                      "text-sm text-gray-600 dark:text-gray-300 leading-relaxed",
                      !showFullDescription && 'line-clamp-2'
                    )}>
                      {task.description}
                    </div>
                    {task.description.length > 100 && (
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        {showFullDescription ? 'Show Less' : 'Read More'}
                        <Eye className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}

                {/* Timestamps */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 dark:text-gray-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Added {formatTimestamp(task.createdAt)}</span>
                  </div>
                  {task.type === TaskType.DAILY && task.completedAt && (
                    <div className="flex items-center gap-1.5 text-green-600 dark:text-green-500/80">
                      <Check className="w-3.5 h-3.5" />
                      <span>Completed {formatTimestamp(task.completedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {!isEditing && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onStartEdit(task.id, {
                  text: task.text,
                  status: task.status,
                  link: task.link || '',
                  website: task.website || '',
                  twitter: task.twitter || '',
                  discord: task.discord || '',
                  telegram: task.telegram || '',
                  description: task.description || ''
                })}
                className="p-2 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Edit Task"
              >
                <Edit2 className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(task.id)}
                className="p-2 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
