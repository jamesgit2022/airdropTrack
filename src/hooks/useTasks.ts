import { useState, useEffect, useCallback } from 'react';
import { Task, TaskType, TaskStatus, ActiveTab, SortOption, EditingTaskData } from '../types/Task';
import { 
  getAllTasksForExport, 
  loadTasks as loadLocalTasks, 
  loadCustomResetTime as loadLocalResetTime, 
  CustomResetTime 
} from '../utils/localStorage';
import { 
  shouldResetDailyTasks, 
  getTimeUntilCustomReset,
  getResetDateString
} from '../utils/dateUtils';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useTasks = () => {
  const { user } = useAuth();
  
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('daily');
  const [newTask, setNewTask] = useState('');
  const [newTaskType, setNewTaskType] = useState<TaskType>(TaskType.DAILY);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>(TaskStatus.EARLY);
  const [newTaskLink, setNewTaskLink] = useState('');
  const [newTaskWebsite, setNewTaskWebsite] = useState('');
  const [newTaskTwitter, setNewTaskTwitter] = useState('');
  const [newTaskDiscord, setNewTaskDiscord] = useState('');
  const [newTaskTelegram, setNewTaskTelegram] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmCompleteModal, setShowConfirmCompleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [taskToConfirmComplete, setTaskToConfirmComplete] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editingTaskData, setEditingTaskData] = useState<EditingTaskData>({
    text: '',
    link: '',
    website: '',
    twitter: '',
    discord: '',
    telegram: '',
    description: '',
    status: TaskStatus.EARLY
  });
  const [customResetTime, setCustomResetTime] = useState<CustomResetTime>({ hour: 0, minute: 0 });
  const [timeUntilReset, setTimeUntilReset] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('none');

  // Load data from Supabase
  useEffect(() => {
    if (!user) {
        setTasks([]);
        setLoading(false);
        return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch User Settings
        let { data: settings, error: settingsError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (settingsError && settingsError.code !== 'PGRST116') { // PGRST116 is "Row not found"
          console.error('Error fetching settings:', settingsError);
        }

        // Initialize settings if not found
        let resetTime = { hour: 0, minute: 0 };
        let lastResetDate = '';
        
        if (settings) {
          resetTime = settings.custom_reset_time;
          lastResetDate = settings.last_reset_date || '';
          setCustomResetTime(resetTime);
        } else {
            // Create default settings
            const { error: insertError } = await supabase
                .from('user_settings')
                .insert([{ 
                    user_id: user.id, 
                    custom_reset_time: resetTime,
                    last_reset_date: ''
                }]);
            
            if (insertError) console.error('Error creating settings:', insertError);
        }

        // 2. Fetch Tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: true });

        if (tasksError) throw tasksError;
        
        let currentTasks = tasksData as Task[] || [];

        // Check for migration needed (if empty online but has local data)
        if (currentTasks.length === 0) {
            const localTasks = loadLocalTasks();
            if (localTasks.length > 0) {
                console.log('Migrating local tasks to Supabase...');
                // Prepare tasks for insertion
                const tasksToInsert = localTasks.map(t => ({
                    ...t,
                    user_id: user.id,
                    // Ensure optional fields are null/undefined correctly if needed, usually fine as is
                }));
                
                const { data: migratedTasks, error: migrationError } = await supabase
                    .from('tasks')
                    .insert(tasksToInsert)
                    .select();
                
                if (!migrationError && migratedTasks) {
                    currentTasks = migratedTasks as Task[];
                    // Also migrate settings
                    const localReset = loadLocalResetTime();
                    await supabase
                        .from('user_settings')
                        .update({ custom_reset_time: localReset })
                        .eq('user_id', user.id);
                    setCustomResetTime(localReset);
                    resetTime = localReset;
                }
            }
        }

        // 3. Check for Daily Reset
        if (shouldResetDailyTasks(lastResetDate, resetTime.hour, resetTime.minute)) {
          const newResetDate = getResetDateString(resetTime.hour, resetTime.minute);
          
          // Identify tasks to reset
          const tasksToReset = currentTasks.filter(t => t.type === TaskType.DAILY && t.completed);
          
          if (tasksToReset.length > 0) {
              // Optimistic update
              currentTasks = currentTasks.map(task => 
                  task.type === TaskType.DAILY 
                    ? { ...task, completed: false, completedAt: undefined }
                    : task
              );

              // Background update
              await supabase
                .from('tasks')
                .update({ completed: false, completed_at: null })
                .eq('user_id', user.id)
                .eq('type', TaskType.DAILY);
          }
          
          // Update last reset date
          await supabase
            .from('user_settings')
            .update({ last_reset_date: newResetDate })
            .eq('user_id', user.id);
        }

        setTasks(currentTasks);

      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilReset(getTimeUntilCustomReset(customResetTime.hour, customResetTime.minute));
    }, 1000);

    return () => clearInterval(timer);
  }, [customResetTime]);

  const resetDailyTasks = useCallback(async () => {
    if (!user) return;
    
    // Optimistic update
    setTasks(prev => prev.map(task => 
      task.type === TaskType.DAILY 
        ? { ...task, completed: false, completedAt: undefined }
        : task
    ));
    
    const newResetDate = getResetDateString(customResetTime.hour, customResetTime.minute);
    
    // DB Update
    await supabase
        .from('tasks')
        .update({ completed: false, completed_at: null })
        .eq('user_id', user.id)
        .eq('type', TaskType.DAILY);

    await supabase
        .from('user_settings')
        .update({ last_reset_date: newResetDate })
        .eq('user_id', user.id);
        
  }, [customResetTime, user]);

  const saveResetTime = useCallback(async (hour: number, minute: number) => {
    if (!user) return;

    const newResetTime = { hour, minute };
    setCustomResetTime(newResetTime); // Optimistic
    setTimeUntilReset(getTimeUntilCustomReset(hour, minute));
    
    await supabase
        .from('user_settings')
        .update({ custom_reset_time: newResetTime })
        .eq('user_id', user.id);
  }, [user]);

  const exportTasksData = useCallback(() => {
      // Export current state tasks
      try {
        const exportData = {
          tasks: tasks,
          customResetTime,
          exportDate: new Date().toISOString(),
          version: '1.0'
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tasks_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error exporting tasks:', error);
        alert('Failed to export tasks.');
      }
  }, [tasks, customResetTime]);

  // Import logic could be complex with Supabase (merge vs overwrite). 
  // For now, let's keep it simple: insert new tasks from file.
  const importTasksData = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const importData = JSON.parse(content);
        
        let tasksToImport: Task[] = [];
        let resetTimeToImport: CustomResetTime | null = null;
        
        if (Array.isArray(importData)) {
          tasksToImport = importData;
        } else if (importData.tasks && Array.isArray(importData.tasks)) {
          tasksToImport = importData.tasks;
          if (importData.customResetTime) resetTimeToImport = importData.customResetTime;
        }
        
        // Filter out existing IDs to avoid duplicates (optional, or rely on UUID)
        // Since local IDs might conflict or be different, better to generate new IDs or upsert
        // We will strip IDs and insert as new for simplicity, or keep ID if it's a UUID
        const cleanedTasks = tasksToImport.map(t => {
            const { id, ...rest } = t; // Remove ID to let DB generate a new one, OR keep it if we want to preserve history
            // But if we remove ID, we lose the link.
            // Let's generate new UUIDs or keep existing string IDs if they are valid UUIDs.
            // Simplest: just insert with user_id.
            return {
                ...t,
                user_id: user.id,
                // Ensure status
                status: t.status || TaskStatus.EARLY
            };
        });

        const { data, error } = await supabase.from('tasks').upsert(cleanedTasks).select();
        
        if (error) throw error;
        
        if (data) {
             setTasks(prev => {
                 // Merge logic: replace existing with same ID, add new
                 const newMap = new Map(prev.map(p => [p.id, p]));
                 data.forEach((d: Task) => newMap.set(d.id, d));
                 return Array.from(newMap.values());
             });
        }

        if (resetTimeToImport) {
          saveResetTime(resetTimeToImport.hour, resetTimeToImport.minute);
        }
        
        alert(`Successfully imported tasks!`);
      } catch (error) {
        console.error('Error importing tasks:', error);
        alert('Failed to import tasks.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }, [user, saveResetTime]);

  const addTask = useCallback(async () => {
    if (newTask.trim() && user) {
      const newTaskObj = {
        // id: generated by DB usually, but for optimistic UI we need a temp ID. 
        // We'll let Supabase return the real ID and update state.
        // Or we can generate a UUID locally.
        text: newTask.trim(),
        completed: false,
        type: newTaskType,
        status: newTaskStatus,
        created_at: Date.now(),
        link: newTaskLink.trim() || undefined,
        website: newTaskWebsite.trim() || undefined,
        twitter: newTaskTwitter.trim() || undefined,
        discord: newTaskDiscord.trim() || undefined,
        telegram: newTaskTelegram.trim() || undefined,
        description: newTaskDescription.trim() || undefined,
        user_id: user.id
      };

      try {
          const { data, error } = await supabase
            .from('tasks')
            .insert([newTaskObj])
            .select()
            .single();

          if (error) throw error;
          if (data) {
              setTasks(prev => [...prev, data as Task]);
          }
      } catch (e) {
          console.error("Error adding task", e);
          alert("Failed to add task");
      }

      setNewTask('');
      setNewTaskStatus(TaskStatus.EARLY);
      setNewTaskLink('');
      setNewTaskWebsite('');
      setNewTaskTwitter('');
      setNewTaskDiscord('');
      setNewTaskTelegram('');
      setNewTaskDescription('');
      setShowTaskInput(false);
    }
  }, [newTask, newTaskType, newTaskStatus, newTaskLink, newTaskWebsite, newTaskTwitter, newTaskDiscord, newTaskTelegram, newTaskDescription, user]);

  const toggleTask = useCallback(async (id: string) => {
    if (!user) return;
    
    // Find task to get current state
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const newCompleted = !task.completed;
    const newCompletedAt = newCompleted ? Date.now() : null; // null for DB

    // Optimistic Update
    setTasks(prev => prev.map(t => 
      t.id === id 
        ? { ...t, completed: newCompleted, completedAt: newCompleted ? Date.now() : undefined }
        : t
    ));

    try {
        const { error } = await supabase
            .from('tasks')
            .update({ completed: newCompleted, completed_at: newCompletedAt })
            .eq('id', id);
        
        if (error) {
            // Revert on error
            setTasks(prev => prev.map(t => 
                t.id === id ? task : t
            ));
            throw error;
        }
    } catch (e) {
        console.error("Error toggling task", e);
    }
  }, [tasks, user]);

  const requestConfirmComplete = useCallback((task: Task) => {
    setTaskToConfirmComplete(task);
    setShowConfirmCompleteModal(true);
  }, []);

  const confirmCompleteTask = useCallback(() => {
    if (taskToConfirmComplete) {
      toggleTask(taskToConfirmComplete.id);
      setTaskToConfirmComplete(null);
    }
    setShowConfirmCompleteModal(false);
  }, [taskToConfirmComplete, toggleTask]);

  const cancelConfirmComplete = useCallback(() => {
    setTaskToConfirmComplete(null);
    setShowConfirmCompleteModal(false);
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTaskToDelete(id);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (taskToDelete && user) {
      // Optimistic
      const prevTasks = [...tasks];
      setTasks(prev => prev.filter(task => task.id !== taskToDelete));
      
      try {
          const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskToDelete);
            
          if (error) {
              setTasks(prevTasks); // Revert
              throw error;
          }
      } catch (e) {
          console.error("Error deleting task", e);
      }
      
      setTaskToDelete(null);
    }
    setShowDeleteModal(false);
  }, [taskToDelete, tasks, user]);

  const startEditing = useCallback((id: string, taskData: EditingTaskData) => {
    setEditingTask(id);
    setEditingTaskData(taskData);
  }, []);

  const saveEdit = useCallback(async () => {
    if (editingTask && editingTaskData.text.trim() && user) {
      const updates = {
          text: editingTaskData.text.trim(),
          status: editingTaskData.status,
          link: editingTaskData.link.trim() || null,
          website: editingTaskData.website.trim() || null,
          twitter: editingTaskData.twitter.trim() || null,
          discord: editingTaskData.discord.trim() || null,
          telegram: editingTaskData.telegram.trim() || null,
          description: editingTaskData.description.trim() || null
      };

      // Optimistic
      setTasks(prev => prev.map(task =>
        task.id === editingTask
          ? { ...task, ...updates } as Task // Cast as Task for simple merge
          : task
      ));

      try {
          const { error } = await supabase
            .from('tasks')
            .update(updates)
            .eq('id', editingTask);
            
          if (error) throw error;
      } catch (e) {
          console.error("Error updating task", e);
          // Could revert here if strict
      }
    }
    setEditingTask(null);
    setEditingTaskData({
      text: '',
      link: '',
      website: '',
      twitter: '',
      discord: '',
      telegram: '',
      description: '',
      status: TaskStatus.EARLY
    });
  }, [editingTask, editingTaskData, user]);

  const cancelEdit = useCallback(() => {
    setEditingTask(null);
    setEditingTaskData({
      text: '',
      link: '',
      website: '',
      twitter: '',
      discord: '',
      telegram: '',
      description: '',
      status: TaskStatus.EARLY
    });
  }, []);

  // Filter and sort tasks
  const getFilteredAndSortedTasks = useCallback(() => {
    let filtered = tasks.filter(task => task.type === activeTab);
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.text.toLowerCase().includes(query) ||
        (task.link && task.link.toLowerCase().includes(query)) ||
        (task.description && task.description.toLowerCase().includes(query))
      );
    }
    
    // Apply completion status filter based on sort option
    if (sortOption === 'completed') {
      filtered = filtered.filter(task => task.completed);
    } else if (sortOption === 'uncompleted') {
      filtered = filtered.filter(task => !task.completed);
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'title-asc':
        filtered.sort((a, b) => a.text.localeCompare(b.text));
        break;
      case 'title-desc':
        filtered.sort((a, b) => b.text.localeCompare(a.text));
        break;
      case 'completed':
      case 'uncompleted':
        break;
      default:
        break;
    }
    
    return filtered;
  }, [tasks, activeTab, searchQuery, sortOption]);

  // Computed values
  const filteredTasks = getFilteredAndSortedTasks();
  const dailyTasks = tasks.filter(task => task.type === TaskType.DAILY);
  const noteTasks = tasks.filter(task => task.type === TaskType.NOTE);
  const waitlistTasks = tasks.filter(task => task.type === TaskType.WAITLIST);
  const testnetTasks = tasks.filter(task => task.type === TaskType.TESTNET);
  
  const dailyCompletedCount = dailyTasks.filter(task => task.completed).length;
  const noteCompletedCount = noteTasks.filter(task => task.completed).length;
  const waitlistCompletedCount = waitlistTasks.filter(task => task.completed).length;
  const testnetCompletedCount = testnetTasks.filter(task => task.completed).length;
  
  const dailyCompletionRate = dailyTasks.length > 0 
    ? Math.round((dailyCompletedCount / dailyTasks.length) * 100) 
    : 0;
  const noteCompletionRate = noteTasks.length > 0 
    ? Math.round((noteCompletedCount / noteTasks.length) * 100) 
    : 0;
  const waitlistCompletionRate = waitlistTasks.length > 0 
    ? Math.round((waitlistCompletedCount / waitlistTasks.length) * 100) 
    : 0;
  const testnetCompletionRate = testnetTasks.length > 0 
    ? Math.round((testnetCompletedCount / testnetTasks.length) * 100) 
    : 0;

  // Calculate streaks
  const calculateDailyStreak = useCallback(() => {
    const completedDailyTasks = dailyTasks.filter(task => task.completed);
    return completedDailyTasks.length;
  }, [dailyTasks]);

  const calculateNoteStreak = useCallback(() => {
    const completedNoteTasks = noteTasks.filter(task => task.completed);
    return completedNoteTasks.length;
  }, [noteTasks]);

  const calculateWaitlistStreak = useCallback(() => {
    const completedWaitlistTasks = waitlistTasks.filter(task => task.completed);
    return completedWaitlistTasks.length;
  }, [waitlistTasks]);

  const calculateTestnetStreak = useCallback(() => {
    const completedTestnetTasks = testnetTasks.filter(task => task.completed);
    return completedTestnetTasks.length;
  }, [testnetTasks]);

  return {
    // State
    tasks: filteredTasks,
    loading,
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
    dailyCompletedCount,
    noteCompletedCount,
    waitlistCompletedCount,
    testnetCompletedCount,
    dailyCompletionRate,
    noteCompletionRate,
    waitlistCompletionRate,
    testnetCompletionRate,
    dailyStreak: calculateDailyStreak(),
    noteStreak: calculateNoteStreak(),
    waitlistStreak: calculateWaitlistStreak(),
    testnetStreak: calculateTestnetStreak(),
    
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
  };
};
