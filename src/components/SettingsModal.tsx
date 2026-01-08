import React, { useState } from 'react';
import { Settings, X, Download, Upload, Clock, Save, Sun, Moon, Monitor, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  currentResetHour: number;
  currentResetMinute: number;
  onSaveResetTime: (hour: number, minute: number) => void;
  onExportData: () => void;
  onImportData: (event: React.ChangeEvent<HTMLInputElement>) => void;
  userEmail?: string;
  onSignOut?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  currentResetHour,
  currentResetMinute,
  onSaveResetTime,
  onExportData,
  onImportData,
  userEmail,
  onSignOut
}) => {
  const [resetHour, setResetHour] = useState(currentResetHour);
  const [resetMinute, setResetMinute] = useState(currentResetMinute);
  const { setTheme } = useTheme();

  const handleSaveResetTime = () => {
    onSaveResetTime(resetHour, resetMinute);
  };

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Theme Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sun className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Theme</h4>
              </div>
              
              <div className="bg-blue-50 dark:bg-gray-700/30 p-4 rounded-2xl mb-4 border border-blue-100 dark:border-gray-600">
                <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                  Choose your preferred theme appearance
                </p>
                
                <div className="grid grid-cols-3 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      theme === 'light'
                        ? 'border-blue-500 bg-blue-100 dark:bg-blue-900'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Sun className="w-5 h-5 text-yellow-500" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Light</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-blue-500 bg-blue-100 dark:bg-blue-900'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Moon className="w-5 h-5 text-blue-500" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Dark</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      localStorage.removeItem('task-tracker-theme');
                      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                      setTheme(systemTheme);
                    }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      !localStorage.getItem('task-tracker-theme')
                        ? 'border-blue-500 bg-blue-100 dark:bg-blue-900'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Monitor className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">System</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Daily Reset Time Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Daily Reset Time</h4>
              </div>
              
              <div className="bg-blue-50 dark:bg-gray-700/30 p-4 rounded-2xl mb-4 border border-blue-100 dark:border-gray-600">
                <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                  Set when your daily tasks should reset. Current time: {formatTime(currentResetHour, currentResetMinute)}
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      Hour (0-23)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={resetHour}
                      onChange={(e) => setResetHour(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      Minute (0-59)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={resetMinute}
                      onChange={(e) => setResetMinute(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveResetTime}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium shadow-lg shadow-blue-500/20"
                >
                  <Save className="w-4 h-4" />
                  Save Reset Time
                </motion.button>
              </div>
            </div>

            {/* Data Management Section */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-4">Data Management</h4>
              
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onExportData}
                  className="w-full flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group bg-white dark:bg-gray-800"
                >
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-800 dark:text-gray-200">Export Data</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Download all your tasks as a JSON file
                    </div>
                  </div>
                </motion.button>

                <motion.label 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group bg-white dark:bg-gray-800"
                >
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-800 dark:text-gray-200">Import Data</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Upload a previously exported JSON file
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={onImportData}
                    className="hidden"
                  />
                </motion.label>
              </div>
            </div>

            {/* Warning Section */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚠️</div>
                <div>
                  <div className="font-medium text-yellow-800 dark:text-yellow-300 text-sm mb-1">Important Notes</div>
                  <ul className="text-yellow-700 dark:text-yellow-400 text-xs space-y-1.5 opacity-90">
                    <li>• Importing data will replace all current tasks</li>
                    <li>• Make sure to export your data before importing</li>
                    <li>• Reset time changes take effect immediately</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
