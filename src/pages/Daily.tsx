import React, { useState, useEffect, useRef } from 'react';
import { Clock, CheckCircle2, TrendingUp, AlertCircle, Users, Fuel, DollarSign, Shield, Trash2, Plus, Trophy, Award, Target, Info, Check, X } from 'lucide-react';
import { checklistSections } from '@/data/checklistData';
import { getPriorityColor, formatTime, getEstimatedTime, getRemainingTime, getCurrentTimePosition } from '@/utils/helpers';

export default function Daily() {
  const [checkedItems, setCheckedItems] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [customTasks, setCustomTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [addingToSection, setAddingToSection] = useState(null);
  const [focusMode, setFocusMode] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [todayScore, setTodayScore] = useState(0);
  const [expandedWhy, setExpandedWhy] = useState({});
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState({});
  const [showTimeIndicator, setShowTimeIndicator] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const sectionsRef = useRef([]);
  const timeIndicatorRef = useRef(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll to current section
  useEffect(() => {
    if (autoScroll && showTimeIndicator) {
      const currentSection = getCurrentSection();
      if (currentSection && sectionsRef.current[currentSection.index]) {
        sectionsRef.current[currentSection.index].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [currentTime, autoScroll, showTimeIndicator]);

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem('gasStationChecklist');
    if (saved) {
      const parsed = JSON.parse(saved);
      const savedDate = new Date(parsed.date);
      const today = new Date();
      if (savedDate.toDateString() !== today.toDateString()) {
        if (parsed.completionPercentage >= 80) {
          const newStreak = (parsed.streak || 0) + 1;
          setStreak(newStreak);
          localStorage.setItem('gasStationStreak', newStreak.toString());
        } else {
          setStreak(0);
          localStorage.setItem('gasStationStreak', '0');
        }
        localStorage.removeItem('gasStationChecklist');
        setCheckedItems({});
      } else {
        setCheckedItems(parsed.items);
        setTodayScore(parsed.completionPercentage || 0);
      }
    }

    const savedCustom = localStorage.getItem('gasStationCustomTasks');
    if (savedCustom) {
      setCustomTasks(JSON.parse(savedCustom));
    }

    const savedStreak = localStorage.getItem('gasStationStreak');
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }

    const savedBest = localStorage.getItem('gasStationBestScore');
    if (savedBest) {
      setBestScore(parseInt(savedBest));
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (Object.keys(checkedItems).length > 0) {
      const totalTasks = getAllTasks().length;
      const completed = Object.values(checkedItems).filter(Boolean).length;
      const percentage = Math.round((completed / totalTasks) * 100);
      
      setTodayScore(percentage);
      
      if (percentage > bestScore) {
        setBestScore(percentage);
        localStorage.setItem('gasStationBestScore', percentage.toString());
      }
      
      localStorage.setItem('gasStationChecklist', JSON.stringify({
        date: new Date().toISOString(),
        items: checkedItems,
        completionPercentage: percentage,
        streak: streak
      }));
    }
  }, [checkedItems, streak, bestScore]);

  // Save custom tasks
  useEffect(() => {
    localStorage.setItem('gasStationCustomTasks', JSON.stringify(customTasks));
  }, [customTasks]);

  // Timer effect
  useEffect(() => {
    if (!activeTimer) return;

    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        const newSeconds = (prev[activeTimer] || 0) + 1;
        return { ...prev, [activeTimer]: newSeconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  const getAllTasks = () => {
    let allTasks = [];
    checklistSections.forEach((section, idx) => {
      const sectionCustomTasks = customTasks.filter(task => task.section === idx);
      const items = [...section.items, ...sectionCustomTasks];
      allTasks = [...allTasks, ...items];
    });
    return allTasks;
  };

  const getNextTask = () => {
    const allTasks = getAllTasks();
    return allTasks.find(task => !checkedItems[task.id]);
  };

  const scrollToNextTask = () => {
    const nextTask = getNextTask();
    if (nextTask) {
      const element = document.getElementById(`task-${nextTask.id}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Get current section based on time
  const getCurrentSection = () => {
    const timePosition = getCurrentTimePosition();
    const hour = timePosition.hours;
    const minute = timePosition.minutes;

    // Map hours to sections
    if (hour >= 3 && hour < 5) return { index: 0, title: 'Morning Self-Care' };
    if (hour >= 5 && hour < 7) return { index: 1, title: 'Opening' };
    if (hour >= 7 && hour < 12) return { index: 2, title: 'Morning Operations' };
    if (hour >= 12 && hour < 15) return { index: 3, title: 'Midday' };
    if (hour >= 15 && hour < 18) return { index: 4, title: 'Afternoon' };
    if (hour >= 18 && hour < 21) return { index: 5, title: 'Evening' };
    if (hour >= 21 || hour < 3) return { index: 6, title: 'Night Security' };
    
    return null;
  };

  const toggleItem = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    
    if (focusMode && !checkedItems[id]) {
      setTimeout(() => {
        const allTasks = getAllTasks();
        const currentIndex = allTasks.findIndex(t => t.id === id);
        const nextUnchecked = allTasks.slice(currentIndex + 1).find(t => !checkedItems[t.id]);
        if (nextUnchecked) {
          const element = document.getElementById(`task-${nextUnchecked.id}`);
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  };

  const toggleWhy = (taskId) => {
    setExpandedWhy(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const addCustomTask = (sectionIndex) => {
    if (newTaskText.trim()) {
      const newTask = {
        id: `custom-${Date.now()}`,
        task: newTaskText.trim(),
        priority: 'medium',
        section: sectionIndex
      };
      setCustomTasks(prev => [...prev, newTask]);
      setNewTaskText('');
      setAddingToSection(null);
    }
  };

  const deleteCustomTask = (taskId) => {
    setCustomTasks(prev => prev.filter(task => task.id !== taskId));
    setCheckedItems(prev => {
      const updated = { ...prev };
      delete updated[taskId];
      return updated;
    });
  };

  const startTimer = (taskId) => {
    setActiveTimer(taskId);
    if (!timerSeconds[taskId]) {
      setTimerSeconds(prev => ({ ...prev, [taskId]: 0 }));
    }
  };

  const stopTimer = () => {
    setActiveTimer(null);
  };

  const completeTaskWithTimer = (taskId) => {
    toggleItem(taskId);
    stopTimer();
    
    if (focusMode) {
      setTimeout(() => {
        const allTasks = getAllTasks();
        const currentIndex = allTasks.findIndex(t => t.id === taskId);
        const nextUnchecked = allTasks.slice(currentIndex + 1).find(t => !checkedItems[t.id]);
        if (nextUnchecked) {
          startTimer(nextUnchecked.id);
          const element = document.getElementById(`task-${nextUnchecked.id}`);
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  };

  const resetChecklist = () => {
    if (confirm('Are you sure you want to reset the entire checklist?')) {
      setCheckedItems({});
      localStorage.removeItem('gasStationChecklist');
    }
  };

  const totalItems = getAllTasks().length;
  const completedItems = Object.values(checkedItems).filter(Boolean).length;
  const completionPercentage = Math.round((completedItems / totalItems) * 100);
  
  const timePosition = getCurrentTimePosition();
  const currentSection = getCurrentSection();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Win The Day - Motivation Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 flex items-center gap-2">
            <Trophy className="w-7 h-7" />
            Win Today = Win The Week = Win The Year
          </h2>

          {/* Real-Time Header */}
          <div className="mb-4 p-4 bg-black/30 rounded-lg backdrop-blur">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xl font-bold">{timePosition.timeString}</span>
                </div>
                <div className="h-8 w-px bg-white/30" />
                <div>
                  <span className="text-sm opacity-90">Current Phase:</span>
                  <span className="ml-2 font-bold text-yellow-300">
                    {currentSection?.title || 'Night Security'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowTimeIndicator(!showTimeIndicator)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    showTimeIndicator 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {showTimeIndicator ? 'Hide Time Guide' : 'Show Time Guide'}
                </button>
                <button
                  onClick={() => setAutoScroll(!autoScroll)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    autoScroll 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {autoScroll ? 'Auto-Follow On' : 'Auto-Follow Off'}
                </button>
              </div>
            </div>

            {/* Day Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="opacity-90">Day Progress</span>
                <span className="font-bold">{Math.round(timePosition.percentage)}%</span>
              </div>
              <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-yellow-400 to-red-500 transition-all duration-1000"
                  style={{ width: `${timePosition.percentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm sm:text-base">
            <p className="font-semibold text-purple-100">
              If you complete this checklist today, you're not just "getting through the day." You're building an empire.
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                Gas Station CEO Daily Checklist
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  const newFocusMode = !focusMode;
                  setFocusMode(newFocusMode);
                  if (newFocusMode) {
                    const allTasks = getAllTasks();
                    const firstUnchecked = allTasks.find(t => !checkedItems[t.id]);
                    if (firstUnchecked) {
                      startTimer(firstUnchecked.id);
                      scrollToNextTask();
                    }
                  } else {
                    stopTimer();
                  }
                }}
                className={`px-3 py-2 sm:px-4 ${focusMode ? 'bg-purple-600' : 'bg-purple-500'} hover:bg-purple-600 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium`}
              >
                {focusMode ? '⏱️ Focus Mode' : 'Focus Mode'}
              </button>
              <button
                onClick={resetChecklist}
                className="px-3 py-2 sm:px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium"
              >
                Reset All
              </button>
            </div>
          </div>

          {/* Next Task Indicator - Focus Mode */}
          {focusMode && getNextTask() && (
            <div className="mb-4 p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-90">Next Task:</p>
                  <p className="text-lg font-bold mt-1">{getNextTask().task}</p>
                </div>
                <button
                  onClick={scrollToNextTask}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
                >
                  Go →
                </button>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Daily Progress</span>
              <span className="text-sm font-bold text-gray-800">{completedItems} / {totalItems} tasks</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 ease-out flex items-center justify-end pr-2"
                style={{ width: `${completionPercentage}%` }}
              >
                {completionPercentage > 10 && (
                  <span className="text-xs text-white font-bold">{completionPercentage}%</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scoreboard */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-xl p-3 sm:p-4 md:p-5 mb-4 sm:mb-6 border-2 border-amber-200">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
              <span className="hidden sm:inline">Today's Scoreboard</span>
              <span className="sm:hidden">Scoreboard</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {/* Today's Score */}
            <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 shadow-md border-2 border-blue-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 sm:mb-2">
                <span className="text-xs font-medium text-gray-600">Today</span>
                <Target className="hidden sm:block w-4 h-4 md:w-5 md:h-5 text-blue-500" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
                {completionPercentage}%
              </div>
              <div className="mt-1 sm:mt-2 text-xs text-gray-500 hidden sm:block">
                {completedItems} of {totalItems} tasks
              </div>
              <div className="mt-1 text-xs text-gray-500 sm:hidden">
                {completedItems}/{totalItems}
              </div>
              {completionPercentage === 100 && (
                <div className="mt-1 sm:mt-2 text-xs font-semibold text-green-600 animate-pulse">
                  🎉 Perfect!
                </div>
              )}
            </div>

            {/* Current Streak */}
            <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 shadow-md border-2 border-orange-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 sm:mb-2">
                <span className="text-xs font-medium text-gray-600">Streak</span>
                <Award className="hidden sm:block w-4 h-4 md:w-5 md:h-5 text-orange-500" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600">
                {streak}
              </div>
              <div className="mt-1 sm:mt-2 text-xs text-gray-500 hidden md:block">
                {streak === 0 ? '80%+ to start' : 'days of 80%+'}
              </div>
            </div>

            {/* Personal Best */}
            <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 shadow-md border-2 border-purple-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 sm:mb-2">
                <span className="text-xs font-medium text-gray-600">Best</span>
                <Trophy className="hidden sm:block w-4 h-4 md:w-5 md:h-5 text-purple-500" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600">
                {bestScore}%
              </div>
              {bestScore === 100 && (
                <div className="mt-1 sm:mt-2 text-xs font-semibold text-purple-600">
                  👑 Champ!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Checklist Sections with Time Indicators */}
        <div className="space-y-4 relative">
          {/* Global Time Indicator Line */}
          {showTimeIndicator && currentSection && (
            <div 
              ref={timeIndicatorRef}
              className="absolute left-0 right-0 pointer-events-none z-10 transition-all duration-1000"
              style={{ 
                top: `${(currentSection.index * 100) / checklistSections.length}%`,
                transform: 'translateY(-50%)'
              }}
            >
              <div className="relative">
                {/* Red line across the page */}
                <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-red-300 shadow-lg" />
                
                {/* Time bubble */}
                <div className="absolute -left-2 -top-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap animate-pulse">
                  ⏰ {timePosition.timeString} - {currentSection.title}
                </div>
                
                {/* Circle indicator */}
                <div className="absolute -left-1 -top-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg" />
              </div>
            </div>
          )}

          {checklistSections.map((section, idx) => {
            const sectionCustomTasks = customTasks.filter(task => task.section === idx);
            const allItems = [...section.items, ...sectionCustomTasks];
            
            const sectionCompleted = allItems.filter(item => checkedItems[item.id]).length;
            const sectionTotal = allItems.length;
            const Icon = section.icon;
            
            // Check if this is the current section
            const isCurrentSection = currentSection?.index === idx;
            
            // Get section time range
            const getTimeRange = () => {
              switch(idx) {
                case 0: return '3:30 AM - 4:30 AM';
                case 1: return '5:00 AM - 7:00 AM';
                case 2: return '7:00 AM - 12:00 PM';
                case 3: return '12:00 PM - 3:00 PM';
                case 4: return '3:00 PM - 6:00 PM';
                case 5: return '6:00 PM - 9:00 PM';
                case 6: return '9:00 PM - 12:00 AM';
                case 7: return 'Weekly';
                default: return '';
              }
            };

            return (
              <div
                key={idx}
                ref={el => sectionsRef.current[idx] = el}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 ${
                  isCurrentSection && showTimeIndicator
                    ? 'ring-4 ring-red-400 ring-opacity-50 scale-101' 
                    : ''
                }`}
              >
                <div className={`${section.color} p-3 md:p-4 text-white`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                      <Icon className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                      <div className="flex-1">
                        <h2 className="text-sm md:text-xl font-bold truncate">{section.title}</h2>
                        <p className="text-xs opacity-90 mt-0.5">{getTimeRange()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isCurrentSection && showTimeIndicator && (
                        <div className="px-2 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold animate-pulse flex items-center gap-1">
                          <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
                          <span>NOW</span>
                        </div>
                      )}
                      <button
                        onClick={() => setAddingToSection(addingToSection === idx ? null : idx)}
                        className="p-1 md:p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        title="Add custom task"
                      >
                        <Plus className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <div className="bg-white/20 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                        {sectionCompleted}/{sectionTotal}
                      </div>
                    </div>
                  </div>
                  
                  {/* Section Progress Bar */}
                  <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-500"
                      style={{ width: `${(sectionCompleted / sectionTotal) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Add Task Form */}
                {addingToSection === idx && (
                  <div className="bg-gray-50 border-b-2 border-gray-200 p-2 sm:p-3 md:p-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addCustomTask(idx)}
                        placeholder="Enter custom task..."
                        className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => addCustomTask(idx)}
                        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setAddingToSection(null);
                          setNewTaskText('');
                        }}
                        className="px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="p-3 sm:p-4 space-y-2">
                  {allItems.map((item) => {
                    const isCustomTask = item.id.startsWith('custom-');
                    const isNextTask = focusMode && getNextTask()?.id === item.id;
                    const showWhy = expandedWhy[item.id];
                    
                    return (
                      <div
                        key={item.id}
                        id={`task-${item.id}`}
                        className={`rounded-lg transition-all ${
                          isNextTask
                            ? 'bg-purple-100 border-2 border-purple-500 shadow-lg scale-101'
                            : checkedItems[item.id]
                            ? 'bg-green-50 border-2 border-green-200'
                            : 'bg-gray-50 hover:bg-blue-50 border-2 border-blue-300'
                        }`}
                      >
                        <div className="flex items-start gap-3 p-3">
                          <div className="flex-1">
                            <span
                              className={`block ${
                                checkedItems[item.id]
                                  ? 'line-through text-gray-500'
                                  : `text-gray-800 ${isNextTask ? 'font-semibold text-purple-900' : getPriorityColor(item.priority)}`
                              }`}
                            >
                              {isNextTask && <span className="text-purple-600 font-bold mr-2">→</span>}
                              {checkedItems[item.id] && (
                                <Check className="w-5 h-5 text-green-600 font-bold mr-2 inline-block" />
                              )}
                              {item.task}
                            </span>

                            {/* Tags Row */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {item.priority === 'high' && !checkedItems[item.id] && !isNextTask && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>Priority</span>
                                </span>
                              )}
                              {isCustomTask && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                  <Plus className="w-3 h-3" />
                                  <span>Custom</span>
                                </span>
                              )}

                              {/* Timer Tag */}
                              {activeTimer === item.id && !checkedItems[item.id] && (
                                (() => {
                                  const remaining = getRemainingTime(item.id, timerSeconds, item);
                                  const estimated = getEstimatedTime(item);
                                  const isOvertime = remaining === 0;
                                  
                                  return (
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 animate-pulse ${
                                      isOvertime 
                                        ? 'bg-red-100 text-red-700 border border-red-300' 
                                        : 'bg-purple-100 text-purple-700 border border-purple-300'
                                    }`}>
                                      <Clock className="w-3 h-3" />
                                      <span>{isOvertime ? '+' : ''}{formatTime(isOvertime ? (timerSeconds[item.id] || 0) - estimated : remaining)}</span>
                                    </span>
                                  );
                                })()
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="px-2 sm:px-3 pb-2 sm:pb-3">
                          <div className="flex flex-wrap gap-1.5">
                            {!checkedItems[item.id] ? (
                              <button
                                onClick={() => {
                                  if (activeTimer === item.id) {
                                    completeTaskWithTimer(item.id);
                                  } else {
                                    toggleItem(item.id);
                                  }
                                }}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all bg-green-500 hover:bg-green-600 text-white shadow-sm"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Complete</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => toggleItem(item.id)}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all bg-gray-200 hover:bg-gray-300 text-gray-600"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Undo</span>
                              </button>
                            )}

                            {item.why && (
                              <button
                                onClick={() => toggleWhy(item.id)}
                                className={`flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                                  showWhy 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                }`}
                              >
                                <Info className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Info</span>
                              </button>
                            )}

                            {isCustomTask && (
                              <button
                                onClick={() => deleteCustomTask(item.id)}
                                className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Delete</span>
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {/* Why Section */}
                        {showWhy && item.why && (
                          <div className="px-3 pb-3 pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded text-sm text-gray-700">
                                <p className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
                                  <Info className="w-4 h-4" />
                                  Why this matters:
                                </p>
                                <p>{item.why}</p>
                              </div>
                              
                              {item.advice && (
                                <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded text-sm text-gray-700">
                                  <p className="font-semibold text-green-900 mb-1 flex items-center gap-1">
                                    <TrendingUp className="w-4 h-4" />
                                    How to do it right:
                                  </p>
                                  <p>{item.advice}</p>
                                </div>
                              )}
                              
                              {item.tools && (
                                <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded text-sm text-gray-700">
                                  <p className="font-semibold text-amber-900 mb-1 flex items-center gap-1">
                                    <Shield className="w-4 h-4" />
                                    Tools needed:
                                  </p>
                                  <p>{item.tools}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 space-y-4">
          {completionPercentage === 100 && (
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-6 text-center shadow-xl animate-pulse">
              <h3 className="text-2xl sm:text-3xl font-bold mb-2">🏆 YOU WON TODAY 🏆</h3>
              <p className="text-lg mb-2">100% Complete. Perfect Execution.</p>
            </div>
          )}
          
          {completionPercentage >= 80 && completionPercentage < 100 && (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-4 text-center shadow-lg">
              <p className="font-bold text-lg">🔥 {completionPercentage}% - You're Almost There!</p>
            </div>
          )}

          <div className="text-center text-gray-500 text-sm space-y-1">
            <p>Click any task to mark it complete. Progress saves automatically.</p>
            <p className="font-semibold text-purple-600">💡 The red line shows you what you should be doing RIGHT NOW</p>
          </div>
        </div>
      </div>
    </div>
  );
}