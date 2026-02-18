// src/pages/GasStationDailyChecklist.tsx
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Circle, TrendingUp, AlertCircle, Users, Fuel, DollarSign, Shield, Trash2, Plus, Trophy, Award, Target, Info, Phone, Calendar, ChevronDown, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';

export default function GasStationDailyChecklist() {
  const [checkedItems, setCheckedItems] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [customTasks, setCustomTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [addingToSection, setAddingToSection] = useState(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [focusMode, setFocusMode] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [todayScore, setTodayScore] = useState(0);
  const [expandedWhy, setExpandedWhy] = useState({});
  const [expandedDateSelector, setExpandedDateSelector] = useState({});
  const [taskHistory, setTaskHistory] = useState({}); // { taskId: { 'YYYY-MM-DD': true/false } }
  const [selectedMonth, setSelectedMonth] = useState({}); // { taskId: 'YYYY-MM' }
  const [activeTab, setActiveTab] = useState('checklist');
  const [wardrobeItems, setWardrobeItems] = useState({});
  const [expandedWardrobeItem, setExpandedWardrobeItem] = useState({});
  const [activeTimer, setActiveTimer] = useState(null); // ID of task with active timer
  const [timerSeconds, setTimerSeconds] = useState({}); // { taskId: seconds }
  const [calendarModalTask, setCalendarModalTask] = useState(null); // Full-screen calendar for task
  const [callFormData, setCallFormData] = useState({
    name: '',
    phone: '',
    timeSlot: '',
    priority: 'medium',
    notes: ''
  });
  const [phoneCalls, setPhoneCalls] = useState([
    {
      id: 'call-example-1',
      name: 'Fuel Supplier - John',
      phone: '+1-555-0123',
      timeSlot: 'Morning: 8:00-9:00 AM',
      priority: 'high',
      notes: 'Negotiate bulk pricing for next quarter',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'call-example-2',
      name: 'Employee Sarah - Scheduling',
      phone: '+1-555-0456',
      timeSlot: 'Midday: 12:30-1:00 PM',
      priority: 'medium',
      notes: 'Discuss vacation request for next month',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'call-example-3',
      name: 'Equipment Repair - ABC Services',
      phone: '+1-555-0789',
      timeSlot: 'Afternoon: 3:00-4:00 PM',
      priority: 'urgent',
      notes: 'Car wash machine malfunction - needs immediate fix',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'call-example-4',
      name: 'Accountant - Tax Review',
      phone: '+1-555-0321',
      timeSlot: 'Evening: 6:30-7:30 PM',
      priority: 'medium',
      notes: 'Quarterly tax planning and expense review',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'call-example-5',
      name: 'Insurance Agent',
      phone: '+1-555-0654',
      timeSlot: 'Morning: 8:00-9:00 AM',
      priority: 'low',
      notes: 'Annual policy renewal discussion',
      completed: false,
      createdAt: new Date().toISOString()
    }
  ]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Load checked items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gasStationChecklist');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Reset if it's a new day
      const savedDate = new Date(parsed.date);
      const today = new Date();
      if (savedDate.toDateString() !== today.toDateString()) {
        // Save yesterday's score before reset
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

    // Load custom tasks
    const savedCustom = localStorage.getItem('gasStationCustomTasks');
    if (savedCustom) {
      setCustomTasks(JSON.parse(savedCustom));
    }

    // Load task history
    const savedHistory = localStorage.getItem('gasStationTaskHistory');
    if (savedHistory) {
      setTaskHistory(JSON.parse(savedHistory));
    }

    // Load wardrobe items
    const savedWardrobe = localStorage.getItem('gasStationWardrobe');
    if (savedWardrobe) {
      setWardrobeItems(JSON.parse(savedWardrobe));
    }

    // Load phone calls (only override examples if saved data exists)
    const savedCalls = localStorage.getItem('gasStationPhoneCalls');
    if (savedCalls) {
      const parsed = JSON.parse(savedCalls);
      // Only load if there's actual saved data (not empty array)
      if (parsed.length > 0) {
        setPhoneCalls(parsed);
      }
    }

    // Load streak
    const savedStreak = localStorage.getItem('gasStationStreak');
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }

    // Load best score
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
      
      // Update best score
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
  }, [checkedItems]);

  // Save custom tasks
  useEffect(() => {
    localStorage.setItem('gasStationCustomTasks', JSON.stringify(customTasks));
  }, [customTasks]);

  // Save task history
  useEffect(() => {
    localStorage.setItem('gasStationTaskHistory', JSON.stringify(taskHistory));
  }, [taskHistory]);

  // Save wardrobe items
  useEffect(() => {
    localStorage.setItem('gasStationWardrobe', JSON.stringify(wardrobeItems));
  }, [wardrobeItems]);

  // Timer effect - runs every second when timer is active
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

  // Save phone calls
  useEffect(() => {
    localStorage.setItem('gasStationPhoneCalls', JSON.stringify(phoneCalls));
  }, [phoneCalls]);

  // Save task history
  useEffect(() => {
    localStorage.setItem('gasStationTaskHistory', JSON.stringify(taskHistory));
  }, [taskHistory]);

  const toggleItem = (id) => {
    const newChecked = !checkedItems[id];
    setCheckedItems(prev => ({
      ...prev,
      [id]: newChecked
    }));
    
    // Track completion date
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    setTaskHistory(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [today]: newChecked
      }
    }));
    
    // Auto-advance to next uncompleted task in focus mode
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

  const toggleDateSelector = (taskId) => {
    setExpandedDateSelector(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
    // Initialize selected month for this task if not set
    if (!selectedMonth[taskId]) {
      const now = new Date();
      setSelectedMonth(prev => ({
        ...prev,
        [taskId]: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      }));
    }
  };

  const getDaysInMonth = (yearMonth) => {
    const [year, month] = yearMonth.split('-').map(Number);
    return new Date(year, month, 0).getDate();
  };

  const isDateCompleted = (taskId, date) => {
    return taskHistory[taskId]?.[date] === true;
  };

  const toggleDateCompletion = (taskId, date) => {
    setTaskHistory(prev => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] || {}),
        [date]: !prev[taskId]?.[date]
      }
    }));
  };

  const changeMonth = (taskId, direction) => {
    const current = selectedMonth[taskId] || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const [year, month] = current.split('-').map(Number);
    let newMonth = month + direction;
    let newYear = year;
    
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    
    setSelectedMonth(prev => ({
      ...prev,
      [taskId]: `${newYear}-${String(newMonth).padStart(2, '0')}`
    }));
  };

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

  const toggleWhy = (taskId) => {
    setExpandedWhy(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const addPhoneCall = (name, phone, timeSlot, priority = 'medium', notes = '') => {
    const newCall = {
      id: `call-${Date.now()}`,
      name,
      phone,
      timeSlot,
      priority,
      notes,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setPhoneCalls(prev => [...prev, newCall]);
  };

  const handleAddCall = (e) => {
    e.preventDefault();
    console.log('Form submitted:', callFormData);
    
    if (callFormData.name && callFormData.timeSlot) {
      addPhoneCall(
        callFormData.name,
        callFormData.phone,
        callFormData.timeSlot,
        callFormData.priority,
        callFormData.notes
      );
      // Reset form
      setCallFormData({
        name: '',
        phone: '',
        timeSlot: '',
        priority: 'medium',
        notes: ''
      });
    } else {
      console.log('Form validation failed:', { 
        hasName: !!callFormData.name, 
        hasTimeSlot: !!callFormData.timeSlot 
      });
    }
  };

  const updateCallForm = (field, value) => {
    setCallFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCallComplete = (callId) => {
    setPhoneCalls(prev => prev.map(call => 
      call.id === callId ? { ...call, completed: !call.completed } : call
    ));
  };

  const deletePhoneCall = (callId) => {
    setPhoneCalls(prev => prev.filter(call => call.id !== callId));
  };

  const toggleWardrobeItem = (itemId) => {
    setWardrobeItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const toggleWardrobeExpand = (itemId) => {
    setExpandedWardrobeItem(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
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
    // Mark task as complete
    toggleItem(taskId);
    // Stop timer
    stopTimer();
    
    // In focus mode, auto-advance to next task
    if (focusMode) {
      setTimeout(() => {
        const allTasks = getAllTasks();
        const currentIndex = allTasks.findIndex(t => t.id === taskId);
        const nextUnchecked = allTasks.slice(currentIndex + 1).find(t => !checkedItems[t.id]);
        if (nextUnchecked) {
          // Start timer on next task
          startTimer(nextUnchecked.id);
          const element = document.getElementById(`task-${nextUnchecked.id}`);
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEstimatedTime = (item) => {
    // Default estimated times based on task type
    if (item.estimatedMinutes) return item.estimatedMinutes * 60; // Convert to seconds
    if (item.task.includes('Brush teeth')) return 120; // 2 minutes
    if (item.task.includes('Floss')) return 60; // 1 minute
    if (item.task.includes('Shower')) return 600; // 10 minutes
    if (item.task.includes('Shampoo')) return 180; // 3 minutes
    if (item.task.includes('Shave')) return 300; // 5 minutes
    if (item.task.includes('Check') || item.task.includes('Verify')) return 180; // 3 minutes
    if (item.task.includes('Review')) return 300; // 5 minutes
    if (item.task.includes('Wash')) return 60; // 1 minute
    return 300; // Default 5 minutes
  };

  const getRemainingTime = (taskId, item) => {
    const elapsed = timerSeconds[taskId] || 0;
    const estimated = getEstimatedTime(item);
    const remaining = Math.max(0, estimated - elapsed);
    return remaining;
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

  const checklistSections = [
    {
      title: "Morning Self-Care (3:30 AM - 4:30 AM)",
      icon: Users,
      color: "bg-cyan-500",
      items: [
        { id: 'selfcare-1', task: 'Wake up and get out of bed', priority: 'high', why: 'Start your day with discipline - how you begin determines your entire day', advice: 'Place alarm across the room so you have to stand up. No snooze button - it ruins sleep quality. Make bed immediately after rising.', tools: 'Alarm clock, smartphone' },
        { id: 'selfcare-2', task: 'Use the toilet', priority: 'high', why: 'Empty your body to feel light and focused for the day ahead', advice: 'Take your time, don\'t rush. Stay hydrated the night before for regularity. Proper posture helps complete emptying.', tools: 'Toilet, toilet paper' },
        { id: 'selfcare-3', task: 'Wash hands thoroughly', priority: 'high', why: 'Kill germs and bacteria - prevents illness and shows professionalism', advice: 'Use warm water, 20 seconds minimum with soap. Scrub between fingers, under nails, and wrists. Pat dry completely to prevent chapping.', tools: 'Soap, warm water, clean towel' },
        { id: 'selfcare-4', task: 'Brush teeth (2 minutes minimum)', priority: 'high', why: 'Prevents cavities, gum disease, and bad breath - protects your smile and health', 
          advice: 'Follow the proper sequence for complete coverage:', 
          adviceSteps: [
            'Wet toothbrush with water',
            'Apply pea-sized amount of fluoride toothpaste',
            'Brush outer surfaces of upper teeth (30 sec)',
            'Brush outer surfaces of lower teeth (30 sec)',
            'Brush inner surfaces of upper teeth (30 sec)',
            'Brush inner surfaces of lower teeth (30 sec)',
            'Brush chewing surfaces of all teeth (20 sec)',
            'Brush your tongue (10 sec)',
            'Brush roof of mouth (10 sec)',
            'Rinse mouth thoroughly with water',
            'Rinse toothbrush and store upright'
          ],
          tools: 'Toothbrush (soft bristles), fluoride toothpaste, timer'
        },
        { id: 'selfcare-5', task: 'Floss between teeth', priority: 'medium', why: 'Removes 40% of plaque brushing misses - prevents heart disease and tooth loss', advice: 'Use 18 inches of floss, wrap around fingers. Gently curve around each tooth in C-shape. Don\'t snap or force - be gentle on gums.', tools: 'Dental floss or floss picks' },
        { id: 'selfcare-6', task: 'Use mouthwash', priority: 'medium', why: 'Kills bacteria brushing can\'t reach - fresh breath builds confidence', advice: 'Swish for 30-60 seconds, don\'t swallow. Use alcohol-free if you have sensitive gums. Wait 30 minutes before eating/drinking.', tools: 'Antiseptic mouthwash, cup' },
        { id: 'selfcare-7', task: 'Wash face with facial cleanser', priority: 'high', why: 'Removes oil and dirt - prevents acne and keeps you looking professional', advice: 'Use lukewarm water, not hot. Massage cleanser in circular motions for 60 seconds. Rinse thoroughly and pat dry, don\'t rub.', tools: 'Facial cleanser, washcloth, towel' },
        { id: 'selfcare-8', task: 'Apply moisturizer/face cream', priority: 'medium', why: 'Prevents dry, aged skin - you look younger and more energetic', advice: 'Apply while skin is still slightly damp. Use upward motions to prevent sagging. SPF moisturizer is best for day use.', tools: 'Moisturizer with SPF, clean hands' },
        { id: 'selfcare-9', task: 'Shower/bathe thoroughly', priority: 'high', why: 'Removes sweat and bacteria - you smell clean and feel refreshed', advice: 'Start with warm water, end with cool to close pores. Wash from top to bottom. Focus on armpits, groin, and feet. Don\'t forget behind ears and neck.', tools: 'Soap/body wash, shampoo, washcloth/loofah, towel' },
        { id: 'selfcare-10', task: 'Shampoo and condition hair', priority: 'medium', why: 'Clean hair prevents dandruff and odor - shows you respect yourself', advice: 'Massage scalp with fingertips, not nails. Rinse shampoo completely before conditioning. Apply conditioner to ends only, not roots.', tools: 'Shampoo, conditioner, shower' },
        { id: 'selfcare-11', task: 'Clean and trim fingernails (if needed)', priority: 'low', why: 'Dirty nails carry germs and look unprofessional - people notice hands', advice: 'Trim straight across, slightly rounded. File edges smooth. Clean under nails with brush. Keep them shorter than fingertips.', tools: 'Nail clippers, nail file, nail brush' },
        { id: 'selfcare-12', task: 'Clean and trim toenails (if needed)', priority: 'low', why: 'Prevents ingrown nails, fungus, and foot pain - comfort matters all day', advice: 'Cut straight across to prevent ingrown nails. Don\'t cut too short. Dry between toes completely after shower. Check for fungus weekly.', tools: 'Toenail clippers, towel, foot file' },
        { id: 'selfcare-13', task: 'Apply deodorant/antiperspirant', priority: 'high', why: 'Prevents body odor for 12+ hours - people respect those who smell good', advice: 'Apply to completely dry skin for best effectiveness. Use antiperspirant at night and morning. Apply to chest too if you sweat heavily.', tools: 'Deodorant or antiperspirant stick/spray' },
        { id: 'selfcare-14', task: 'Shave face/trim beard', priority: 'medium', why: 'Clean shave shows discipline and professionalism - commands respect', advice: 'Shave with the grain first, against for closer shave. Use sharp blades. Shave after shower when hair is soft. Rinse with cold water after.', tools: 'Razor/electric shaver, shaving cream/gel, aftershave' },
        { id: 'selfcare-15', task: 'Apply aftershave/cologne', priority: 'low', why: 'Signature scent creates memorable impressions and boosts confidence', advice: 'Less is more - 2-3 sprays maximum. Apply to pulse points: wrists, neck, chest. Don\'t rub wrists together. Spray 6 inches away from skin.', tools: 'Cologne or aftershave, possibly fragrance-free moisturizer' },
        { id: 'selfcare-16', task: 'Trim nose/ear hair (if needed)', priority: 'low', why: 'Details matter - groomed appearance shows you care about yourself', advice: 'Use rounded-tip scissors or electric trimmer. Only trim visible hair, don\'t go deep. Check in good lighting. Do this weekly.', tools: 'Nose hair trimmer or small scissors, mirror' },
        { id: 'selfcare-17', task: 'Apply lip balm', priority: 'low', why: 'Prevents cracked lips - healthy lips show vitality and health', advice: 'Apply after brushing teeth and before going outside. Reapply every 2-3 hours. Use SPF lip balm in sun. Don\'t lick lips - makes dryness worse.', tools: 'Lip balm with SPF' },
        { id: 'selfcare-18', task: 'Comb/style hair', priority: 'medium', why: 'Groomed hair shows self-respect - first thing people see is your head', advice: 'Use wide-tooth comb on wet hair. Style when slightly damp for best hold. Use minimal product - less is more. Have a consistent style.', tools: 'Comb or brush, hair product (gel/pomade), mirror' },
        { id: 'selfcare-19', task: 'Apply sunscreen (if applicable)', priority: 'medium', why: 'Prevents skin cancer and premature aging - protects your future self', advice: 'Use SPF 30+ minimum. Apply 15 minutes before sun exposure. Reapply every 2 hours outdoors. Don\'t forget ears, neck, and hands.', tools: 'Sunscreen SPF 30+' },
        { id: 'selfcare-20', task: 'Check skin for any issues', priority: 'low', why: 'Early detection saves lives - catch problems before they grow', advice: 'Look for new moles or changing spots. Check for redness, rashes, or unusual marks. Use mirror for back. See dermatologist annually.', tools: 'Mirror (full-length and handheld), good lighting' },
        { id: 'selfcare-21', task: 'Dress in clean, professional clothes', priority: 'high', why: 'You\'re the boss - dress like it. People follow leaders who look the part', advice: 'Iron shirts night before. Match belt with shoes. Dark colors look more authoritative. Ensure no stains, wrinkles, or loose threads.', tools: 'Clean clothes, iron, shoe polish, lint roller' },
        { id: 'selfcare-22', task: 'Put on socks and shoes', priority: 'high', why: 'Protected feet work all day - comfort affects your energy and mood', advice: 'Wear clean socks daily - prevents odor and fungus. Choose supportive shoes for long standing. Rotate shoes to extend life. Keep spare socks at work.', tools: 'Clean socks, comfortable shoes, shoe horn' },
        { id: 'selfcare-23', task: 'Apply body lotion (if dry skin)', priority: 'low', why: 'Healthy skin feels better and looks younger - prevents itching and cracking', advice: 'Apply right after shower while skin is damp. Focus on elbows, knees, and hands. Use unscented if you wear cologne. Apply daily in winter.', tools: 'Body lotion or moisturizer' },
        { id: 'selfcare-24', task: 'Clean ears (cotton swab exterior only)', priority: 'low', why: 'Clean ears prevent infections and waxy buildup - hygiene is health', advice: 'NEVER insert into ear canal - damages eardrum. Clean outer ear and behind ears only. Dry ears after shower. See doctor if excess wax.', tools: 'Cotton swabs, towel' },
        { id: 'selfcare-25', task: 'Take any morning vitamins/medications', priority: 'medium', why: 'Your body needs nutrients to perform - invest in your health daily', advice: 'Take with food to prevent nausea. Keep pills in visible spot so you don\'t forget. Set phone reminder. Track on calendar or app.', tools: 'Vitamins/medications, water, pill organizer' },
        { id: 'selfcare-26', task: 'Drink water (at least 8 oz)', priority: 'medium', why: 'Hydration boosts energy, focus, and metabolism - you\'ll feel sharper', advice: 'Drink room temperature for better absorption. Add lemon for vitamin C. Aim for half your body weight in ounces daily. Start day with water before coffee.', tools: 'Water bottle or glass, filtered water' },
        { id: 'selfcare-27', task: 'Quick stretch or breathing exercises', priority: 'low', why: 'Prepares your body and mind - reduces stress and increases alertness', advice: '5 deep breaths: inhale 4 counts, hold 4, exhale 4. Stretch neck, shoulders, and back. Touch toes. Reduces morning stiffness.', tools: 'Comfortable space, yoga mat (optional)' },
      ]
    },
    {
      title: "Opening (5:00 AM - 7:00 AM)",
      icon: Clock,
      color: "bg-orange-500",
      items: [
        { id: 'opening-1', task: 'Unlock and disarm security system', priority: 'high', why: 'First security check - ensures no overnight breaches, protects assets', advice: 'Check alarm panel for tamper alerts. Verify all zones before disarming. Note any unusual beeps or errors. Keep code confidential - change quarterly.', tools: 'Security code, flashlight, incident log' },
        { id: 'opening-2', task: 'Check overnight incident reports and surveillance footage', priority: 'high', why: 'Spot problems early - prevents liability and catches theft immediately', advice: 'Review last 8 hours at 4x speed. Focus on cash areas, fuel pumps, and perimeter. Save suspicious clips. Document all incidents in writing.', tools: 'DVR/NVR system, computer, incident report forms' },
        { id: 'opening-3', task: 'Verify cash registers and safe contents', priority: 'high', why: 'Confirms no shortages or theft - protects your profits and catches dishonesty', advice: 'Count starting cash twice for accuracy. Compare to closing report. Check bills for counterfeits. Document discrepancies immediately with witnesses.', tools: 'Cash drawer keys, safe combination, calculator, counterfeit pen' },
        { id: 'opening-4', task: 'Inspect fuel pumps and emergency shutoffs', priority: 'high', why: 'Safety first - prevents fires, explosions, and lawsuits that could destroy your business', advice: 'Test emergency shutoff button monthly. Check for fuel puddles or strong odors. Verify all nozzles hang properly. Report leaks to fire marshal immediately.', tools: 'Flashlight, absorbent pads, emergency contact list' },
        { id: 'opening-5', task: 'Check tank levels and order fuel if needed', priority: 'medium', why: 'Never run out of product - lost sales = lost money and angry customers', advice: 'Check levels at 25% remaining. Order 2-3 days ahead for delivery time. Track daily usage patterns. Have backup supplier for emergencies.', tools: 'Tank monitoring system, supplier contact info, order forms' },
        { id: 'opening-6', task: 'Walk the lot for cleanliness and safety hazards', priority: 'medium', why: 'Clean lot attracts customers - trash and hazards drive business away', advice: 'Pick up trash, check for broken glass. Ensure lights work. Look for trip hazards. Note needed repairs. Do this systematically - same route daily.', tools: 'Trash grabber, broom, dustpan, work gloves, notepad' },
        { id: 'opening-7', task: 'Review staff schedule and confirm coverage', priority: 'medium', why: 'Prevents chaos - short staffing kills customer service and burns out employees', advice: 'Call no-shows within 15 minutes of shift start. Have backup list ready. Cross-train employees. Post schedule 2 weeks ahead.', tools: 'Staff schedule, phone, contact list, time clock' },
      ]
    },
    {
      title: "Morning Operations (7:00 AM - 12:00 PM)",
      icon: TrendingUp,
      color: "bg-blue-500",
      items: [
        { id: 'morning-1', task: 'Hold brief team meeting - review daily goals', priority: 'medium', why: 'Aligned team wins - clear goals prevent confusion and boost performance', advice: 'Keep it under 10 minutes. Stand, don\'t sit. Focus on 3 priorities only. Ask for questions. Make it energizing, not boring.', tools: 'Meeting agenda, clipboard, daily goals sheet' },
        { id: 'morning-2', task: 'Check fuel pricing vs competitors, adjust if needed', priority: 'high', why: 'Price too high loses customers, too low loses profit - stay competitive', advice: 'Check 3 nearest competitors online or by driving by. Adjust within 0.05/gallon. Track price changes in spreadsheet. Know your break-even price.', tools: 'Competitor price app, pricing software, calculator, profit margin sheet' },
        { id: 'morning-3', task: 'Review sales reports from previous day', priority: 'medium', why: 'Data reveals trends - spot problems and opportunities before they grow', advice: 'Compare to last week same day. Look for anomalies. Check if promotions worked. Note bestsellers vs dead stock. Track weather impact.', tools: 'POS system, sales reports, spreadsheet, calculator' },
        { id: 'morning-4', task: 'Inspect convenience store inventory and merchandising', priority: 'medium', why: 'Empty shelves = lost sales - attractive displays increase impulse buys', advice: 'Face products forward. Check expiration dates. Put bestsellers at eye level. Rotate stock - first in, first out. Clean dusty packages.', tools: 'Inventory checklist, pricing gun, cleaning supplies, step stool' },
        { id: 'morning-5', task: 'Monitor rush hour traffic and pump efficiency', priority: 'low', why: 'Fast service = more customers - slow pumps cost you thousands daily', advice: 'Time average transaction from start to finish. Check for pump errors. Clear any payment issues immediately. Add staff if lines form.', tools: 'Stopwatch, pump status monitor, walkie-talkie' },
        { id: 'morning-6', task: 'Check restroom cleanliness (hourly spot checks)', priority: 'medium', why: 'Dirty bathrooms lose customers forever - cleanliness drives repeat business', advice: 'Check toilet paper, soap, paper towels. Wipe counters. Mop visible messes immediately. Use checklist on door. Hourly initials required.', tools: 'Cleaning checklist, supplies caddy, mop, disinfectant, air freshener' },
        { id: 'morning-7', task: 'Respond to emails and vendor communications', priority: 'low', why: 'Delays cost money - quick responses get better deals and solve problems faster', advice: 'Set aside 15 minutes for emails. Respond same day to urgent items. File systematically. Use templates for common responses. Unsubscribe from junk.', tools: 'Computer, email, phone, vendor contact list' },
      ]
    },
    {
      title: "Midday (12:00 PM - 3:00 PM)",
      icon: Users,
      color: "bg-green-500",
      items: [
        { id: 'midday-1', task: 'Conduct employee check-ins and performance observations', priority: 'medium', why: 'Catch issues early - coaching in the moment prevents bigger problems later', advice: 'Praise publicly, correct privately. Be specific about what you saw. Ask "how can I help you succeed?" Listen more than talk. Document conversations.', tools: 'Performance log, notepad, private office/area' },
        { id: 'midday-2', task: 'Review lunch shift transition and cash drawer exchanges', priority: 'high', why: 'Shift changes expose theft - tight controls protect your cash', advice: 'Both employees count together. Sign off on count sheet. Verify amounts match. Check for counterfeit bills. Lock up excess cash immediately.', tools: 'Cash count sheets, calculator, safe, counterfeit pen, witness' },
        { id: 'midday-3', task: 'Check food service compliance (if applicable)', priority: 'medium', why: 'Health violations shut you down - one inspection failure costs thousands', advice: 'Check food temperatures with thermometer. Verify hand washing compliance. Check dates on all perishables. Clean as you go. Follow health code checklist.', tools: 'Food thermometer, health code checklist, gloves, sanitizer' },
        { id: 'midday-4', task: 'Review loyalty program signups and promotions', priority: 'low', why: 'Repeat customers are profit - loyalty programs increase lifetime value 3x', advice: 'Track daily signup goals. Train staff to ask every customer. Offer instant rewards. Promote benefits on signage. Review redemption data weekly.', tools: 'Loyalty system, signup reports, promotional materials' },
        { id: 'midday-5', task: 'Inspect equipment: car wash, air pump, vacuum stations', priority: 'medium', why: 'Broken equipment = lost revenue - working amenities increase fuel sales', advice: 'Test each function. Check coin mechanisms. Look for damage. Post "out of order" immediately. Keep vendor repair numbers handy. Track downtime costs.', tools: 'Test coins/tokens, repair log, vendor contacts, tools, "out of order" signs' },
        { id: 'midday-6', task: 'Monitor inventory levels for fast-moving items', priority: 'low', why: 'Out of stock = frustrated customers - keep bestsellers always available', advice: 'Check top 20 sellers daily. Set reorder points. Order before you run out. Track seasonal patterns. Have backup suppliers for emergencies.', tools: 'Inventory system, reorder list, calculator, supplier contacts' },
      ]
    },
    {
      title: "Afternoon (3:00 PM - 6:00 PM)",
      icon: Fuel,
      color: "bg-purple-500",
      items: [
        { id: 'afternoon-1', task: 'Prepare for evening rush - ensure all pumps operational', priority: 'high', why: 'Evening rush is peak profit time - one broken pump costs hundreds per hour', advice: 'Test each pump. Clear error messages. Check receipt paper levels. Ensure card readers work. Have backup supplies ready. Add staff if needed.', tools: 'Pump diagnostic tools, receipt paper, card reader tester, cleaning supplies' },
        { id: 'afternoon-2', task: 'Check fuel delivery schedule and confirm next delivery', priority: 'medium', why: 'Running out of gas destroys reputation - customers won\'t come back', advice: 'Call supplier to confirm delivery time. Ensure space available for truck. Be present for delivery. Verify quantity on delivery ticket. Check for water in tanks.', tools: 'Delivery schedule, supplier phone number, tank stick, delivery log' },
        { id: 'afternoon-3', task: 'Review weekly P&L statements and budget variances', priority: 'medium', why: 'Numbers don\'t lie - spot overspending before it kills your margins', advice: 'Compare actual vs budget. Investigate variances over 10%. Look for unexpected costs. Identify cost-cutting opportunities. Update forecasts monthly.', tools: 'P&L statement, budget spreadsheet, calculator, highlighter' },
        { id: 'afternoon-4', task: 'Conduct safety walk-through and document findings', priority: 'high', why: 'Lawsuits bankrupt businesses - prevention is 100x cheaper than litigation', advice: 'Use standard checklist. Take photos of hazards. Fix critical items immediately. Schedule repairs for others. Keep documentation for insurance.', tools: 'Safety checklist, camera/phone, incident forms, repair log' },
        { id: 'afternoon-5', task: 'Meet with vendors or handle deliveries', priority: 'low', why: 'Good vendor relationships get better prices - save thousands annually', advice: 'Count inventory on delivery. Check for damage. Verify invoice matches delivery. Build rapport with reps. Negotiate payment terms. Get multiple quotes.', tools: 'Clipboard, invoice copies, calculator, pen, business cards' },
        { id: 'afternoon-6', task: 'Update training schedules and compliance certifications', priority: 'low', why: 'Untrained staff cause accidents - certifications protect you legally', advice: 'Track expiration dates. Schedule renewals 30 days ahead. Keep certificates posted. Document all training. OSHA compliance is non-negotiable.', tools: 'Training tracker, calendar, certificate copies, compliance binder' },
      ]
    },
    {
      title: "Evening (6:00 PM - 9:00 PM)",
      icon: DollarSign,
      color: "bg-yellow-500",
      items: [
        { id: 'evening-1', task: 'Supervise evening shift transition', priority: 'medium', why: 'Night shift needs clear handoff - confusion leads to errors and theft', advice: 'Written shift notes - never verbal only. Review key tasks. Introduce any issues. Verify night staff has all keys and codes. Clear communication prevents problems.', tools: 'Shift handoff log, keys, codes, task list, phone numbers' },
        { id: 'evening-2', task: 'Review daily sales performance and adjust targets', priority: 'medium', why: 'What gets measured gets improved - daily tracking compounds profits', advice: 'Compare to daily goal. Calculate variance percentage. Identify what worked. Plan tomorrow\'s focus. Celebrate wins with team. Course-correct quickly.', tools: 'Daily sales report, goal tracker, calculator, whiteboard' },
        { id: 'evening-3', task: 'Verify night shift staffing and security protocols', priority: 'high', why: 'Night shifts are high-risk - proper coverage prevents robberies and injuries', advice: 'Minimum 2 employees after dark. Verify panic button works. Review robbery procedures. Check door locks. Ensure phone accessible. Limit cash in drawer.', tools: 'Staff schedule, security checklist, panic button, locks, phone' },
        { id: 'evening-4', task: 'Check lighting - lot, canopy, signage all functional', priority: 'high', why: 'Dark stations attract crime and accidents - bright lights = safety and sales', advice: 'Replace burnt bulbs immediately. Check all areas after dark. Report electrical issues. Clean light covers monthly. Bright = safe. Document any issues.', tools: 'Flashlight, ladder, replacement bulbs, electrical tape, maintenance log' },
        { id: 'evening-5', task: 'Conduct cash office procedures and bank deposit prep', priority: 'high', why: 'Secure cash immediately - overnight theft is your responsibility', advice: 'Count in secure location. Use 2-person rule for large amounts. Verify deposit slip. Use tamper-evident bags. Vary deposit times. Bank before closing.', tools: 'Safe, cash bags, deposit slips, calculator, witness, security escort' },
        { id: 'evening-6', task: 'Review customer feedback and online reviews', priority: 'low', why: 'Bad reviews kill business - address complaints before they spread online', advice: 'Respond to reviews within 24 hours. Apologize for bad experiences. Fix systemic issues. Thank positive reviewers. Track complaint trends. Train staff on feedback.', tools: 'Computer, review sites (Google, Yelp), response templates, notepad' },
      ]
    },
    {
      title: "Night Security (9:00 PM - 12:00 AM)",
      icon: Shield,
      color: "bg-indigo-500",
      items: [
        { id: 'night-1', task: 'Final security check - cameras, alarms, perimeter', priority: 'high', why: 'Overnight security prevents thousands in losses - verify everything works', advice: 'Test all cameras - check blind spots. Verify alarm zones. Walk perimeter. Check locks on all doors. Ensure emergency exits clear. Test panic buttons.', tools: 'Camera monitor, alarm panel, flashlight, keys, perimeter checklist' },
        { id: 'night-2', task: 'Verify night staff understands emergency procedures', priority: 'high', why: 'Emergencies happen at night - trained staff can save lives and assets', advice: 'Quiz staff on robbery procedures. Review fire evacuation. Confirm emergency contacts. Practice using fire extinguisher. Ensure first aid accessible.', tools: 'Emergency procedures manual, first aid kit, fire extinguisher, contact list' },
        { id: 'night-3', task: 'Review incident log and address any issues', priority: 'medium', why: 'Unresolved issues escalate - fix small problems before they become crises', advice: 'Read all shift notes. Follow up on customer complaints. Investigate theft reports. Document actions taken. Forward serious issues to authorities.', tools: 'Incident log, notepad, camera access, phone, police non-emergency number' },
        { id: 'night-4', task: 'Plan next day priorities and staff assignments', priority: 'low', why: 'Planning tonight saves chaos tomorrow - start the day with clarity', advice: 'List top 3 priorities. Assign tasks to specific people. Note any deliveries. Plan for weather impacts. Review maintenance needs. Prep opening checklist.', tools: 'Planner, staff schedule, weather app, priority list, calendar' },
        { id: 'night-5', task: 'Set security system for overnight monitoring', priority: 'high', why: 'Armed security deters crime - one robbery costs more than years of monitoring', advice: 'Arm all zones. Test motion sensors. Verify monitoring company connection. Set up mobile alerts. Check battery backup. Document arming time.', tools: 'Security panel, code, phone app, backup key, monitoring company contact' },
      ]
    },
    {
      title: "Weekly/Strategic Tasks",
      icon: AlertCircle,
      color: "bg-red-500",
      items: [
        { id: 'weekly-1', task: 'Review weekly sales trends and KPIs', priority: 'medium', why: 'Trends reveal opportunities - weekly reviews let you pivot before losing momentum', advice: 'Track: sales, transactions, average ticket, fuel gallons. Compare week-over-week. Look for patterns. Identify growth opportunities. Set next week targets.', tools: 'Weekly reports, spreadsheet, graphs, calculator, highlighter' },
        { id: 'weekly-2', task: 'Conduct formal staff performance reviews', priority: 'medium', why: 'Good employees need feedback - reviews improve performance and reduce turnover', advice: 'Schedule 1-on-1 meetings. Prepare written feedback. Use examples. Set specific goals. Ask for their input. Document discussion. Follow up in 30 days.', tools: 'Performance review forms, employee files, goals worksheet, private office' },
        { id: 'weekly-3', task: 'Inspect and test fire safety equipment', priority: 'high', why: 'Gas stations are fire risks - working equipment saves lives and prevents lawsuits', advice: 'Test fire extinguishers monthly. Check dates. Verify emergency shutoff accessible. Test fire alarm. Ensure exit signs lit. Document all tests in log.', tools: 'Fire extinguisher checklist, testing gauge, alarm panel, maintenance log' },
        { id: 'weekly-4', task: 'Review and update emergency contact lists', priority: 'low', why: 'Emergencies need quick response - outdated contacts waste critical minutes', advice: 'Verify all numbers work. Add new staff immediately. Remove terminated employees. Post by each phone. Include: police, fire, poison control, utilities.', tools: 'Contact list template, phone, laminator, posted lists' },
        { id: 'weekly-5', task: 'Analyze competitor pricing and market trends', priority: 'medium', why: 'Market changes daily - staying informed keeps you competitive and profitable', advice: 'Visit competitors weekly. Note their prices, promotions, improvements. Read industry news. Join trade association. Network with other owners. Stay ahead.', tools: 'Competitor tracking sheet, industry publications, smartphone, notebook' },
        { id: 'weekly-6', task: 'Plan promotional campaigns and marketing initiatives', priority: 'low', why: 'Marketing drives traffic - promotions can double sales during slow periods', advice: 'Plan 2 weeks ahead. Use social media. Create urgency. Track results. Test different offers. Partner with local businesses. Build email list.', tools: 'Marketing calendar, social media, promotional materials, email software' },
        { id: 'weekly-7', task: 'Review insurance and compliance documentation', priority: 'medium', why: 'Compliance gaps risk fines and shutdown - stay current to stay in business', advice: 'Keep certificates current. File renewals 60 days early. Review coverage annually. Document all inspections. Keep binder accessible. Know your agent.', tools: 'Insurance binder, compliance checklist, calendar, agent contact info' },
      ]
    }
  ];

  const totalItems = checklistSections.reduce((acc, section) => acc + section.items.length, 0);
  const completedItems = Object.values(checkedItems).filter(Boolean).length;
  const completionPercentage = Math.round((completedItems / totalItems) * 100);

  const resetChecklist = () => {
    if (confirm('Are you sure you want to reset the entire checklist?')) {
      setCheckedItems({});
      localStorage.removeItem('gasStationChecklist');
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 font-semibold';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Ultra Clean Pill-Shaped Tab Bar */}
        <div className="overflow-x-auto -mx-2 sm:-mx-4 md:-mx-6 mb-6">
          <div className="flex gap-2 min-w-max px-2 sm:px-4 md:px-6">
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-5 sm:px-7 py-2.5 font-medium text-sm transition-all whitespace-nowrap rounded-full ${
                activeTab === 'checklist'
                  ? 'bg-black text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Checklist
            </button>
            <button
              onClick={() => setActiveTab('calls')}
              className={`px-5 sm:px-7 py-2.5 font-medium text-sm transition-all whitespace-nowrap rounded-full ${
                activeTab === 'calls'
                  ? 'bg-black text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Calls
            </button>
            <button
              onClick={() => setActiveTab('finance')}
              className={`px-5 sm:px-7 py-2.5 font-medium text-sm transition-all whitespace-nowrap rounded-full ${
                activeTab === 'finance'
                  ? 'bg-black text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Finance
            </button>
            <button
              onClick={() => setActiveTab('dating')}
              className={`px-5 sm:px-7 py-2.5 font-medium text-sm transition-all whitespace-nowrap rounded-full ${
                activeTab === 'dating'
                  ? 'bg-black text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Dating
            </button>
            <button
              onClick={() => setActiveTab('wardrobe')}
              className={`px-5 sm:px-7 py-2.5 font-medium text-sm transition-all whitespace-nowrap rounded-full ${
                activeTab === 'wardrobe'
                  ? 'bg-black text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Wardrobe
            </button>
          </div>
        </div>

        {/* Checklist Tab Content */}
        {activeTab === 'checklist' && (
          <>
        {/* Win The Day - Motivation Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 flex items-center gap-2">
            <Trophy className="w-7 h-7" />
            Win Today = Win The Week = Win The Year
          </h2>

          {/* Habit vs Task Legend */}
          <div className="flex flex-wrap gap-3 mb-4 p-3 bg-white/10 rounded-lg backdrop-blur">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-green-400 bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-sm font-medium">
                <span className="text-green-300 inline-flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Habits
                </span> = Daily repeated actions (self-care, routines)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-blue-400 bg-blue-100 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-blue-600" />
              </div>
              <span className="text-sm font-medium">
                <span className="text-blue-300 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Tasks
                </span> = Specific work items (check, verify, review)
              </span>
            </div>
          </div>
          <div className="space-y-3 text-sm sm:text-base">
            <p className="font-semibold text-purple-100">
              If you complete this checklist today, you're not just "getting through the day." You're building an empire.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
                <p className="font-bold mb-1">🎯 TODAY You Win By:</p>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>• Opening strong (no lazy mornings)</li>
                  <li>• Running a tight operation (zero chaos)</li>
                  <li>• Making smart decisions (not reactive ones)</li>
                  <li>• Closing clean (no loose ends)</li>
                </ul>
              </div>

              <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
                <p className="font-bold mb-1">📈 THIS WEEK Compounds Into:</p>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>• 7 perfect days = unstoppable momentum</li>
                  <li>• Staff respects systems, not emotions</li>
                  <li>• Problems get solved before they blow up</li>
                  <li>• Business runs without you micromanaging</li>
                </ul>
              </div>

              <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
                <p className="font-bold mb-1">🚀 THIS YEAR Transforms Into:</p>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>• 365 days of discipline = financial freedom</li>
                  <li>• Predictable profit (not hoping for luck)</li>
                  <li>• Time for relationships, dating, growth</li>
                  <li>• Wardrobe upgraded, finances fixed, life leveled up</li>
                </ul>
              </div>

              <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
                <p className="font-bold mb-1">💎 THE MATH IS SIMPLE:</p>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>• 1 perfect day = 1% better</li>
                  <li>• 7 perfect days = 7% better</li>
                  <li>• 52 perfect weeks = 3,700% ROI</li>
                  <li>• You're literally unstoppable</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-4 bg-black/30 rounded-lg border-2 border-white/20">
              <p className="font-bold text-lg mb-2">⚡ The Real Truth:</p>
              <p className="text-purple-100">
                Most people lose because they break the chain. One lazy morning becomes a lazy week. One skipped task becomes a pattern. One "I'll do it tomorrow" becomes a year of mediocrity.
              </p>
              <p className="font-bold mt-3 text-white text-lg">
                You're different. You finish this list. Every. Single. Day.
              </p>
              <p className="mt-2 italic text-purple-200">
                "Success is nothing more than a few simple disciplines, practiced every day." — Jim Rohn
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xl sm:text-2xl font-bold text-yellow-300">
                Check every box today. Win the day. Repeat tomorrow. Dominate the year.
              </p>
            </div>
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
              {completionPercentage >= 90 && completionPercentage < 100 && (
                <div className="mt-1 sm:mt-2 text-xs font-semibold text-blue-600">
                  ⭐ Almost!
                </div>
              )}
              {completionPercentage >= 80 && completionPercentage < 90 && (
                <div className="mt-1 sm:mt-2 text-xs font-semibold text-amber-600">
                  💪 Great!
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
              <div className="mt-1 text-xs text-gray-500 md:hidden">
                {streak === 0 ? 'Get 80%+' : 'days'}
              </div>
              {streak >= 7 && (
                <div className="mt-1 sm:mt-2 text-xs font-semibold text-orange-600">
                  🔥 Fire!
                </div>
              )}
              {streak >= 30 && (
                <div className="mt-1 sm:mt-2 text-xs font-semibold text-red-600">
                  🚀 Beast!
                </div>
              )}
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
              <div className="mt-1 sm:mt-2 text-xs text-gray-500 hidden md:block">
                {bestScore === completionPercentage && completionPercentage > 0 ? 'New record! 🎯' : 'Your highest'}
              </div>
              <div className="mt-1 text-xs text-gray-500 md:hidden">
                {bestScore === completionPercentage && completionPercentage > 0 ? '🎯 New!' : 'Record'}
              </div>
              {bestScore === 100 && (
                <div className="mt-1 sm:mt-2 text-xs font-semibold text-purple-600">
                  👑 Champ!
                </div>
              )}
            </div>
          </div>

          {/* Motivational Message */}
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white text-center">
            <p className="font-semibold text-xs sm:text-sm md:text-base">
              {completionPercentage >= 100 ? '🏆 Perfect execution! You\'re a champion!' :
               completionPercentage >= 90 ? '🌟 Outstanding! Keep pushing!' :
               completionPercentage >= 80 ? '💪 You\'re doing great! Finish strong!' :
               completionPercentage >= 50 ? '📈 Good progress! Keep going!' :
               completionPercentage >= 25 ? '🎯 You\'re on your way! Stay focused!' :
               '🚀 Let\'s get started! Every task counts!'}
            </p>
          </div>
        </div>

        {/* Checklist Sections */}
        <div className="space-y-4">
          {checklistSections.map((section, idx) => {
            // Merge custom tasks for this section with default items
            const sectionCustomTasks = customTasks.filter(task => task.section === idx);
            const allItems = [...section.items, ...sectionCustomTasks];
            
            const sectionCompleted = allItems.filter(item => checkedItems[item.id]).length;
            const sectionTotal = allItems.length;
            const Icon = section.icon;

            return (
              <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className={`${section.color} p-3 md:p-4 text-white flex items-center justify-between gap-2`}>
                  <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                    <h2 className="text-sm md:text-xl font-bold truncate">{section.title}</h2>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
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
                            : section.title.includes('Self-Care')
                            ? 'bg-gray-50 hover:bg-green-50 border-2 border-green-300'
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

                            {/* Tags Row - Type, Priority, Custom, Timer */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {/* Type Badge - Habit vs Task */}
                              {idx === 0 && section.title.includes('Self-Care') && !checkedItems[item.id] && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold inline-flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" />
                                  <span>Habit</span>
                                </span>
                              )}
                              {idx === 0 && !section.title.includes('Self-Care') && !section.title.includes('Weekly') && !checkedItems[item.id] && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold inline-flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Task</span>
                                </span>
                              )}
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

                              {/* Timer Tag - Compact Rectangle */}
                              {activeTimer === item.id && !checkedItems[item.id] && (
                                (() => {
                                  const remaining = getRemainingTime(item.id, item);
                                  const estimated = getEstimatedTime(item);
                                  const percentLeft = (remaining / estimated) * 100;
                                  const isWarning = percentLeft <= 50 && percentLeft > 20;
                                  const isUrgent = percentLeft <= 20;
                                  const isOvertime = remaining === 0;
                                  
                                  return (
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 animate-pulse ${
                                      isOvertime 
                                        ? 'bg-red-100 text-red-700 border border-red-300' 
                                        : isUrgent 
                                        ? 'bg-orange-100 text-orange-700 border border-orange-300'
                                        : isWarning
                                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                                        : 'bg-purple-100 text-purple-700 border border-purple-300'
                                    }`}>
                                      <Clock className="w-3 h-3" />
                                      <span>{isOvertime ? '+' : ''}{formatTime(isOvertime ? (timerSeconds[item.id] || 0) - estimated : remaining)}</span>
                                      {isOvertime && <span className="text-xs">OVER</span>}
                                    </span>
                                  );
                                })()
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons - Compact Mobile Friendly */}
                        <div className="px-2 sm:px-3 pb-2 sm:pb-3">
                          <div className="flex flex-wrap gap-1.5">
                            {/* Mark Complete Button - Primary Action */}
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

                            {/* Info Button */}
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

                            {/* Track Dates Button */}
                            <button
                              onClick={() => setCalendarModalTask(item)}
                              className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg text-xs font-medium transition-all bg-green-50 text-green-600 hover:bg-green-100"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Dates</span>
                            </button>

                            {/* Delete Button - Custom Tasks Only */}
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
                              {/* Why */}
                              <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded text-sm text-gray-700">
                                <p className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
                                  <Info className="w-4 h-4" />
                                  Why this matters:
                                </p>
                                <p>{item.why}</p>
                              </div>
                              
                              {/* Advice */}
                              {item.advice && (
                                <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded text-sm text-gray-700">
                                  <p className="font-semibold text-green-900 mb-1 flex items-center gap-1">
                                    <TrendingUp className="w-4 h-4" />
                                    How to do it right:
                                  </p>
                                  <p>{item.advice}</p>
                                  {item.adviceSteps && item.adviceSteps.length > 0 && (
                                    <ol className="mt-2 space-y-1 text-xs">
                                      {item.adviceSteps.map((step, idx) => (
                                        <li key={idx} className="flex gap-2">
                                          <span className="font-semibold text-green-800">{idx + 1}.</span>
                                          <span>{step}</span>
                                        </li>
                                      ))}
                                    </ol>
                                  )}
                                </div>
                              )}
                              
                              {/* Tools Needed */}
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
          {/* Completion Victory Message */}
          {completionPercentage === 100 && (
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-6 text-center shadow-xl animate-pulse">
              <h3 className="text-2xl sm:text-3xl font-bold mb-2">🏆 YOU WON TODAY 🏆</h3>
              <p className="text-lg mb-2">100% Complete. Perfect Execution.</p>
              <p className="text-sm opacity-90">Tomorrow, you'll do it again. That's how champions are built.</p>
            </div>
          )}
          
          {/* Progress Encouragement */}
          {completionPercentage >= 80 && completionPercentage < 100 && (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-4 text-center shadow-lg">
              <p className="font-bold text-lg">🔥 {completionPercentage}% - You're Almost There!</p>
              <p className="text-sm opacity-90 mt-1">Finish strong. Winners don't leave things 90% done.</p>
            </div>
          )}

          <div className="text-center text-gray-500 text-sm space-y-1">
            <p>Click any task to mark it complete. Progress saves automatically.</p>
            <p className="font-semibold text-purple-600">💡 Enable Focus Mode for a no-willpower system - auto-highlights your next task!</p>
            <p>Checklist resets daily at midnight.</p>
          </div>
        </div>
        </>
        )}

        {/* Phone Calls Tab Content */}
        {activeTab === 'calls' && (
          <>
            <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                  Call Schedule
                </h2>
              </div>

              {/* Add Call Form */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Schedule New Call</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={callFormData.name}
                      onChange={(e) => setCallFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Name / Contact"
                      className="px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                    />
                    <input
                      type="tel"
                      value={callFormData.phone}
                      onChange={(e) => setCallFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Phone Number"
                      className="px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      value={callFormData.timeSlot}
                      onChange={(e) => setCallFormData(prev => ({ ...prev, timeSlot: e.target.value }))}
                      className="px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                    >
                      <option value="">Select Time Window</option>
                      <option value="Morning: 8:00-9:00 AM">Morning: 8:00-9:00 AM</option>
                      <option value="Midday: 12:30-1:00 PM">Midday: 12:30-1:00 PM</option>
                      <option value="Afternoon: 3:00-4:00 PM">Afternoon: 3:00-4:00 PM</option>
                      <option value="Evening: 6:30-7:30 PM">Evening: 6:30-7:30 PM</option>
                      <option value="Custom">Custom Time</option>
                    </select>
                    
                    <select
                      value={callFormData.priority}
                      onChange={(e) => setCallFormData(prev => ({ ...prev, priority: e.target.value }))}
                      className="px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <textarea
                    value={callFormData.notes}
                    onChange={(e) => setCallFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Notes / Purpose of call (optional)"
                    rows="2"
                    className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      if (callFormData.name && callFormData.timeSlot) {
                        const newCall = {
                          id: `call-${Date.now()}`,
                          name: callFormData.name,
                          phone: callFormData.phone,
                          timeSlot: callFormData.timeSlot,
                          priority: callFormData.priority,
                          notes: callFormData.notes,
                          completed: false,
                          createdAt: new Date().toISOString()
                        };
                        setPhoneCalls(prev => [...prev, newCall]);
                        setCallFormData({
                          name: '',
                          phone: '',
                          timeSlot: '',
                          priority: 'medium',
                          notes: ''
                        });
                      } else {
                        alert('Please fill in Name and Time Window');
                      }
                    }}
                    className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-semibold text-sm"
                  >
                    + Add Call to Schedule
                  </button>
                </div>
              </div>

              {/* Call Windows Info */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <h3 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">📋 The System:</h3>
                <ul className="text-xs sm:text-sm text-gray-700 space-y-1">
                  <li>• <strong>Never say "whenever"</strong> - Always offer 2-3 specific windows</li>
                  <li>• <strong>If they can't make it</strong> - "Next availability is [time]"</li>
                  <li>• <strong>Urgent test</strong> - Does this lose money today? Is someone in danger?</li>
                  <li>• <strong>If not urgent</strong> - "Let's do it at [time]" (no negotiation)</li>
                  <li>• <strong>People adapt</strong> - Respect follows consistency</li>
                </ul>
              </div>

              {/* Calls List */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 text-base sm:text-lg">Scheduled Calls</h3>
                
                {phoneCalls.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Phone className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No calls scheduled yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {phoneCalls
                      .sort((a, b) => {
                        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
                        return priorityOrder[a.priority] - priorityOrder[b.priority];
                      })
                      .map((call) => (
                        <div
                          key={call.id}
                          className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                            call.completed
                              ? 'bg-green-50 border-green-200'
                              : call.priority === 'urgent'
                              ? 'bg-red-50 border-red-300'
                              : call.priority === 'high'
                              ? 'bg-orange-50 border-orange-300'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => toggleCallComplete(call.id)}
                              className="mt-1 flex-shrink-0"
                            >
                              {call.completed ? (
                                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                              ) : (
                                <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                              )}
                            </button>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-1">
                                <h4 className={`font-semibold text-sm sm:text-base ${call.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                  {call.name}
                                </h4>
                                <div className="flex items-center gap-2 flex-wrap">
                                  {call.priority === 'urgent' && !call.completed && (
                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                                      🚨 URGENT
                                    </span>
                                  )}
                                  {call.priority === 'high' && !call.completed && (
                                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">
                                      High Priority
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                                {call.phone && (
                                  <p>
                                    📱 <a href={`tel:${call.phone}`} className="text-blue-600 hover:underline">{call.phone}</a>
                                  </p>
                                )}
                                <p>🕐 {call.timeSlot}</p>
                                {call.notes && (
                                  <p className="text-gray-500 italic">"{call.notes}"</p>
                                )}
                              </div>
                            </div>
                            
                            <button
                              onClick={() => deletePhoneCall(call.id)}
                              className="p-1 sm:p-1.5 text-red-500 hover:bg-red-100 rounded transition-colors flex-shrink-0"
                              title="Delete call"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Finance Tab Content */}
        {activeTab === 'finance' && (
          <>
            <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                  Financial Recovery System
                </h2>
              </div>

              {/* The Truth */}
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <h3 className="font-bold text-red-900 mb-2 text-lg">🚨 The Hard Truth</h3>
                <p className="text-red-800 mb-2">You're not bad with money. You have a broken system.</p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• You don't track where money goes</li>
                  <li>• You make emotional purchases</li>
                  <li>• You have no forcing function to save</li>
                  <li>• You confuse income with wealth</li>
                </ul>
              </div>

              {/* The System - Non-Negotiable Rules */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-green-900 mb-3 text-lg">💪 The Automatic System (No Willpower Required)</h3>
                
                <div className="space-y-4">
                  {/* Rule 1 */}
                  <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-bold text-gray-800 mb-2">Rule 1: Pay Yourself First (Automatic)</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Action:</strong> Set up automatic transfer on payday → 20% to savings account you can't easily access
                    </p>
                    <p className="text-xs text-gray-600 italic">Why: You can't spend what you don't see. Automation removes willpower.</p>
                  </div>

                  {/* Rule 2 */}
                  <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-bold text-gray-800 mb-2">Rule 2: The 50/30/20 Budget (Forced System)</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>50% Needs</strong> - Rent, utilities, fuel, food (non-negotiable)</li>
                      <li>• <strong>30% Wants</strong> - Restaurants, entertainment, upgrades</li>
                      <li>• <strong>20% Savings</strong> - Emergency fund, then investments</li>
                    </ul>
                    <p className="text-xs text-gray-600 italic mt-2">Why: Clear boundaries prevent "I'll just spend a little more."</p>
                  </div>

                  {/* Rule 3 */}
                  <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
                    <h4 className="font-bold text-gray-800 mb-2">Rule 3: The 48-Hour Rule (Delay Mechanism)</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Action:</strong> Any purchase over $100 → Wait 48 hours before buying
                    </p>
                    <p className="text-xs text-gray-600 italic">Why: Impulse purchases happen in seconds. Time kills bad decisions.</p>
                  </div>

                  {/* Rule 4 */}
                  <div className="bg-white p-4 rounded-lg border-l-4 border-orange-500">
                    <h4 className="font-bold text-gray-800 mb-2">Rule 4: Cash Envelope System (Physical Limit)</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Action:</strong> Withdraw weekly "fun money" in cash. When it's gone, it's gone.
                    </p>
                    <p className="text-xs text-gray-600 italic">Why: Cards feel like fake money. Cash is real and painful to spend.</p>
                  </div>

                  {/* Rule 5 */}
                  <div className="bg-white p-4 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-bold text-gray-800 mb-2">Rule 5: Kill Subscriptions (Automatic Bleeding)</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Action:</strong> Cancel anything you haven't used in 30 days. Set calendar reminder to review monthly.
                    </p>
                    <p className="text-xs text-gray-600 italic">Why: $10/month = $120/year. 10 subscriptions = $1,200 wasted.</p>
                  </div>
                </div>
              </div>

              {/* Emergency Fund Tracker */}
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-yellow-900 mb-3">🎯 Emergency Fund Goal</h3>
                <p className="text-sm text-yellow-800 mb-3">Target: 6 months of expenses (minimum $10,000)</p>
                <div className="bg-white rounded-lg p-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-bold text-gray-800">$0 / $10,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div className="bg-gradient-to-r from-yellow-400 to-green-500 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ width: '0%' }}>
                      0%
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 italic">Update this manually as you save. Seeing progress = motivation.</p>
                </div>
              </div>

              {/* Quick Wins */}
              <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-blue-900 mb-3">⚡ Quick Wins (Do Today)</h3>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-2 hover:bg-blue-100 rounded cursor-pointer">
                    <input type="checkbox" className="mt-1 w-5 h-5" />
                    <span className="text-sm text-gray-700">Set up automatic 20% transfer to savings on payday</span>
                  </label>
                  <label className="flex items-start gap-3 p-2 hover:bg-blue-100 rounded cursor-pointer">
                    <input type="checkbox" className="mt-1 w-5 h-5" />
                    <span className="text-sm text-gray-700">List all subscriptions and cancel unused ones</span>
                  </label>
                  <label className="flex items-start gap-3 p-2 hover:bg-blue-100 rounded cursor-pointer">
                    <input type="checkbox" className="mt-1 w-5 h-5" />
                    <span className="text-sm text-gray-700">Calculate monthly expenses for 50/30/20 budget</span>
                  </label>
                  <label className="flex items-start gap-3 p-2 hover:bg-blue-100 rounded cursor-pointer">
                    <input type="checkbox" className="mt-1 w-5 h-5" />
                    <span className="text-sm text-gray-700">Open high-yield savings account (separate from checking)</span>
                  </label>
                  <label className="flex items-start gap-3 p-2 hover:bg-blue-100 rounded cursor-pointer">
                    <input type="checkbox" className="mt-1 w-5 h-5" />
                    <span className="text-sm text-gray-700">Delete saved payment info from shopping sites</span>
                  </label>
                </div>
              </div>

              {/* The Real Talk */}
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                <h3 className="font-bold text-purple-900 mb-2">💎 The Real Talk</h3>
                <div className="text-sm text-purple-800 space-y-2">
                  <p><strong>You don't have a money problem. You have a system problem.</strong></p>
                  <p>Rich people aren't smarter. They have automatic systems that make bad decisions impossible.</p>
                  <p className="font-semibold mt-3">The fastest way to wealth:</p>
                  <ol className="list-decimal ml-5 space-y-1">
                    <li>Increase income (focus on your business)</li>
                    <li>Decrease expenses (automate savings first)</li>
                    <li>Don't touch the gap (invest it)</li>
                  </ol>
                  <p className="italic mt-3">"You will never feel rich by spending. Only by saving."</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Dating Tab Content */}
        {activeTab === 'dating' && (
          <>
            <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                  Dating System
                </h2>
              </div>

              {/* The Reality */}
              <div className="bg-black text-white p-4 rounded-lg mb-6">
                <h3 className="font-bold mb-2 text-lg">The Reality</h3>
                <p className="mb-2">Dating is a numbers game combined with systems.</p>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>• Quality comes from quantity - you need volume to find matches</li>
                  <li>• Most men fail because they focus on one woman at a time</li>
                  <li>• Dating multiple people keeps you from becoming needy</li>
                  <li>• Your time is valuable - optimize it</li>
                </ul>
              </div>

              {/* The System */}
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-rose-300 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-rose-900 mb-3 text-lg">The 4-Phase System</h3>
                
                <div className="space-y-4">
                  {/* Phase 1 */}
                  <div className="bg-white p-4 rounded-lg border-l-4 border-rose-500">
                    <h4 className="font-bold text-gray-800 mb-2">Phase 1: Mass Outreach (Volume)</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Goal:</strong> 20-30 conversations per week minimum
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Apps: Tinder, Hinge, Bumble (all three simultaneously)</li>
                      <li>• IRL: Coffee shops, gym, grocery stores, events</li>
                      <li>• Social circle: Friends of friends, group activities</li>
                      <li>• Time investment: 30 min daily on apps, always open IRL</li>
                    </ul>
                    <p className="text-xs text-gray-600 italic mt-2">Rule: Never fixate. Keep swiping even when you have matches.</p>
                  </div>

                  {/* Phase 2 */}
                  <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
                    <h4 className="font-bold text-gray-800 mb-2">Phase 2: Filtering (Qualify Fast)</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Goal:</strong> Spend minimal time on low-potential matches
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Respond rate test: If she's not matching your energy, move on</li>
                      <li>• 3-message rule: After 3 exchanges, ask to meet or call</li>
                      <li>• Red flags: Flakiness, one-word answers, attention-seeking</li>
                      <li>• Green flags: Asks questions, invests effort, shows up</li>
                    </ul>
                    <p className="text-xs text-gray-600 italic mt-2">Rule: Don't chase. The right ones make it easy.</p>
                  </div>

                  {/* Phase 3 */}
                  <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-bold text-gray-800 mb-2">Phase 3: First Dates (Low Investment)</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Goal:</strong> Efficient, repeatable, low-cost dates
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Template: Coffee, drinks, or walk (1 hour max)</li>
                      <li>• Same location every time (logistics mastered)</li>
                      <li>• Never dinner on first date (too much time/money)</li>
                      <li>• Schedule multiple per week (Tuesday, Thursday, Saturday)</li>
                    </ul>
                    <p className="text-xs text-gray-600 italic mt-2">Rule: First date = chemistry check, not commitment.</p>
                  </div>

                  {/* Phase 4 */}
                  <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-bold text-gray-800 mb-2">Phase 4: Rotation Management</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Goal:</strong> Maintain 3-5 active prospects simultaneously
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Track: Name, interests, last conversation topic, next date</li>
                      <li>• Spacing: See each person once per week maximum</li>
                      <li>• Boundaries: Be honest - you're casually dating</li>
                      <li>• Decision point: After 4-6 dates, evaluate for exclusivity</li>
                    </ul>
                    <p className="text-xs text-gray-600 italic mt-2">Rule: Don't commit until you're certain. Options = power.</p>
                  </div>
                </div>
              </div>

              {/* Conversation Tracker */}
              <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-blue-900 mb-3">Active Pipeline Tracker</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-white rounded">
                    <span className="text-gray-600">Conversations Started (This Week)</span>
                    <span className="font-bold">0 / 20 goal</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded">
                    <span className="text-gray-600">Numbers/Socials Collected</span>
                    <span className="font-bold">0</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded">
                    <span className="text-gray-600">Dates Scheduled</span>
                    <span className="font-bold">0</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded">
                    <span className="text-gray-600">Active Rotation</span>
                    <span className="font-bold">0 / 5 target</span>
                  </div>
                </div>
              </div>

              {/* Message Templates */}
              <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Proven Message Templates</h3>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs font-semibold text-gray-600 mb-1">OPENING (Apps):</p>
                    <p className="text-sm text-gray-800">"[Observation about profile] - what's the story behind that?"</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs font-semibold text-gray-600 mb-1">TRANSITION TO MEET:</p>
                    <p className="text-sm text-gray-800">"This is fun, but texting is terrible. Coffee this week? Tuesday or Thursday work for you?"</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs font-semibold text-gray-600 mb-1">HANDLING FLAKES:</p>
                    <p className="text-sm text-gray-800">"No worries! If you change your mind, you know where to find me." (Then move on)</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs font-semibold text-gray-600 mb-1">FOLLOW-UP AFTER DATE:</p>
                    <p className="text-sm text-gray-800">"Had a great time. Let's do it again - I'll text you this weekend."</p>
                  </div>
                </div>
              </div>

              {/* Weekly Action Items */}
              <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-green-900 mb-3">Weekly Minimum Actions</h3>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-2 hover:bg-green-100 rounded cursor-pointer">
                    <input type="checkbox" className="mt-1 w-5 h-5" />
                    <span className="text-sm text-gray-700">30 min daily on dating apps (swipe/message)</span>
                  </label>
                  <label className="flex items-start gap-3 p-2 hover:bg-green-100 rounded cursor-pointer">
                    <input type="checkbox" className="mt-1 w-5 h-5" />
                    <span className="text-sm text-gray-700">Approach 3-5 women IRL (gym, coffee, etc.)</span>
                  </label>
                  <label className="flex items-start gap-3 p-2 hover:bg-green-100 rounded cursor-pointer">
                    <input type="checkbox" className="mt-1 w-5 h-5" />
                    <span className="text-sm text-gray-700">Schedule minimum 2 dates this week</span>
                  </label>
                  <label className="flex items-start gap-3 p-2 hover:bg-green-100 rounded cursor-pointer">
                    <input type="checkbox" className="mt-1 w-5 h-5" />
                    <span className="text-sm text-gray-700">Follow up with existing conversations</span>
                  </label>
                  <label className="flex items-start gap-3 p-2 hover:bg-green-100 rounded cursor-pointer">
                    <input type="checkbox" className="mt-1 w-5 h-5" />
                    <span className="text-sm text-gray-700">Cut off low-effort/flaky prospects</span>
                  </label>
                </div>
              </div>

              {/* The Mindset */}
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <h3 className="font-bold text-yellow-900 mb-2">The Winning Mindset</h3>
                <div className="text-sm text-yellow-800 space-y-2">
                  <p><strong>Abundance > Scarcity:</strong> You're choosing, not chasing.</p>
                  <p><strong>Time = Respect:</strong> Don't waste yours on people who don't invest back.</p>
                  <p><strong>Outcome Independence:</strong> You're fine alone. Dating is a bonus, not a need.</p>
                  <p><strong>Volume Creates Options:</strong> The more you date, the better you get, the higher your standards.</p>
                  <p className="font-semibold mt-3">Remember: The goal isn't to date everyone forever. It's to have enough options to find someone truly exceptional.</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Wardrobe Tab Content */}
        {activeTab === 'wardrobe' && (
          <>
            <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                Wardrobe System
              </h2>

              {/* Essential Items Checklist */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Essential Items (Click to Expand Details)</h3>
                
                {/* Tops */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-500"></div>
                    Tops
                  </h4>
                  <div className="space-y-2">
                    {[
                      { id: 'top-0', name: 'Uniqlo Supima Cotton T-Shirt (White)', price: '$14.90', where: 'Uniqlo.com or store', notes: 'Pack of 3. Soft, durable, perfect fit. Size: S/M/L based on fit', link: 'https://www.uniqlo.com/us/en/men/tops/t-shirts' },
                      { id: 'top-1', name: 'Uniqlo Supima Cotton T-Shirt (Black)', price: '$14.90', where: 'Uniqlo.com or store', notes: 'Pack of 3. Essential staple. Hides stains better than white', link: 'https://www.uniqlo.com/us/en/men/tops/t-shirts' },
                      { id: 'top-2', name: 'Uniqlo Supima Cotton T-Shirt (Navy)', price: '$14.90', where: 'Uniqlo.com or store', notes: 'Pack of 2. Versatile, less formal than black', link: 'https://www.uniqlo.com/us/en/men/tops/t-shirts' },
                      { id: 'top-3', name: 'Charles Tyrwhitt Non-Iron Dress Shirt (White)', price: '$39-79', where: 'CTShirts.com', notes: 'Classic fit or slim fit. 100% cotton. Perfect for business', link: 'https://www.ctshirts.com/us/mens-shirts/' },
                      { id: 'top-4', name: 'Charles Tyrwhitt Non-Iron Dress Shirt (Light Blue)', price: '$39-79', where: 'CTShirts.com', notes: 'More versatile than white. Pairs with everything', link: 'https://www.ctshirts.com/us/mens-shirts/' },
                      { id: 'top-5', name: 'Lacoste Classic Fit Polo (Black)', price: '$98', where: 'Lacoste.com, Nordstrom', notes: 'Iconic croc logo. Pique cotton. Size 3-6 (S-XL)', link: 'https://www.lacoste.com/us/men/clothing/polos.html' },
                      { id: 'top-6', name: 'Lacoste Classic Fit Polo (Navy)', price: '$98', where: 'Lacoste.com, Nordstrom', notes: 'Alternative to black. Slightly more casual', link: 'https://www.lacoste.com/us/men/clothing/polos.html' },
                      { id: 'top-7', name: 'Everlane Heavyweight Henley (Gray)', price: '$45', where: 'Everlane.com', notes: 'Premium cotton. Perfect weight. Casual sophistication', link: 'https://www.everlane.com/collections/mens-tees' },
                      { id: 'top-8', name: 'Uniqlo Merino Crew Neck Sweater (Black)', price: '$49.90', where: 'Uniqlo.com or store', notes: 'Extra fine merino. Washable. Layering essential', link: 'https://www.uniqlo.com/us/en/men/sweaters-and-cardigans' },
                      { id: 'top-9', name: 'Uniqlo Merino Crew Neck Sweater (Navy)', price: '$49.90', where: 'Uniqlo.com or store', notes: 'Slightly less formal. Great with chinos', link: 'https://www.uniqlo.com/us/en/men/sweaters-and-cardigans' },
                    ].map((item) => {
                      const isExpanded = expandedWhy[item.id];
                      return (
                        <div key={item.id} className="bg-white border-2 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleWardrobeItem(item.id)}
                            className={`w-full flex items-center justify-between p-3 transition-all ${
                              wardrobeItems[item.id]
                                ? 'bg-green-50 border-green-500'
                                : 'bg-red-50'
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              {wardrobeItems[item.id] ? (
                                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                              ) : (
                                <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                              )}
                              <span className="text-sm font-medium text-gray-800 text-left">{item.name}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWhy(item.id);
                              }}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Info className="w-4 h-4 text-gray-600" />
                            </button>
                          </button>
                          {isExpanded && (
                            <div className="p-3 bg-gray-50 border-t text-sm space-y-2">
                              <p><strong>Price:</strong> {item.price}</p>
                              <p><strong>Where to buy:</strong> {item.where}</p>
                              <p><strong>Notes:</strong> {item.notes}</p>
                              <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-block px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs font-medium">
                                Shop Now →
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottoms */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="w-1 h-6 bg-purple-500"></div>
                    Bottoms
                  </h4>
                  <div className="space-y-2">
                    {[
                      { id: 'bottom-0', name: 'Levi\'s 511 Slim Fit Jeans (Dark Stonewash)', price: '$69.50', where: 'Levi.com, Amazon', notes: 'Modern slim fit. Dark wash = versatile. 32x32 or your size', link: 'https://www.levi.com/US/en_US/clothing/men/jeans/c/levi_clothing_men_jeans' },
                      { id: 'bottom-1', name: 'Levi\'s 511 Slim Fit Jeans (Light Stonewash)', price: '$69.50', where: 'Levi.com, Amazon', notes: 'Casual alternative. Weekend wear. Same fit as dark', link: 'https://www.levi.com/US/en_US/clothing/men/jeans/c/levi_clothing_men_jeans' },
                      { id: 'bottom-2', name: 'Levi\'s 511 Slim Fit Jeans (Black)', price: '$69.50', where: 'Levi.com, Amazon', notes: 'Night out essential. Sleek, sophisticated', link: 'https://www.levi.com/US/en_US/clothing/men/jeans/c/levi_clothing_men_jeans' },
                      { id: 'bottom-3', name: 'Bonobos Stretch Washed Chinos (Navy)', price: '$88', where: 'Bonobos.com', notes: 'Athletic or slim fit. 2% stretch = comfort. Wrinkle-resistant', link: 'https://bonobos.com/shop/pants/chinos' },
                      { id: 'bottom-4', name: 'Bonobos Stretch Washed Chinos (Khaki)', price: '$88', where: 'Bonobos.com', notes: 'Classic color. Business casual staple', link: 'https://bonobos.com/shop/pants/chinos' },
                      { id: 'bottom-5', name: 'Bonobos Stretch Washed Chinos (Gray)', price: '$88', where: 'Bonobos.com', notes: 'Modern neutral. Pairs with everything', link: 'https://bonobos.com/shop/pants/chinos' },
                      { id: 'bottom-6', name: 'J.Crew Ludlow Dress Pants (Black)', price: '$128', where: 'JCrew.com', notes: 'Slim fit. Wool blend. Formal events only', link: 'https://www.jcrew.com/r/search/?N=0&Nloc=en&Ntrm=ludlow%20pants' },
                      { id: 'bottom-7', name: 'Lululemon Pace Breaker Shorts 9" (Navy)', price: '$68', where: 'Lululemon.com or store', notes: 'Liner included. Quick-dry. Gym and casual', link: 'https://shop.lululemon.com/c/men-shorts/_/N-8r6' },
                      { id: 'bottom-8', name: 'J.Crew 9" Gramercy Shorts (Khaki)', price: '$69.50', where: 'JCrew.com', notes: 'Stretch cotton. Above-knee fit. Summer essential', link: 'https://www.jcrew.com/r/search/?N=0&Nloc=en&Ntrm=shorts' },
                    ].map((item) => {
                      const isExpanded = expandedWhy[item.id];
                      return (
                        <div key={item.id} className="bg-white border-2 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleWardrobeItem(item.id)}
                            className={`w-full flex items-center justify-between p-3 transition-all ${
                              wardrobeItems[item.id]
                                ? 'bg-green-50 border-green-500'
                                : 'bg-red-50'
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              {wardrobeItems[item.id] ? (
                                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                              ) : (
                                <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                              )}
                              <span className="text-sm font-medium text-gray-800 text-left">{item.name}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWhy(item.id);
                              }}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Info className="w-4 h-4 text-gray-600" />
                            </button>
                          </button>
                          {isExpanded && (
                            <div className="p-3 bg-gray-50 border-t text-sm space-y-2">
                              <p><strong>Price:</strong> {item.price}</p>
                              <p><strong>Where to buy:</strong> {item.where}</p>
                              <p><strong>Notes:</strong> {item.notes}</p>
                              <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-block px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs font-medium">
                                Shop Now →
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Shoes */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="w-1 h-6 bg-orange-500"></div>
                    Shoes
                  </h4>
                  <div className="space-y-2">
                    {[
                      { id: 'shoe-0', name: 'Adidas Stan Smith (White/Green)', price: '$90', where: 'Adidas.com, Amazon', notes: 'Iconic minimalist sneaker. Goes with everything. TTS sizing', link: 'https://www.adidas.com/us/stan-smith-shoes' },
                      { id: 'shoe-1', name: 'Common Projects Achilles Low (Black)', price: '$425', where: 'CommonProjects.com, SSENSE', notes: 'Premium leather. Minimal logo. Size down 1. Investment piece', link: 'https://www.commonprojects.com/' },
                      { id: 'shoe-2', name: 'Thursday Captain Boots (Brown)', price: '$199', where: 'ThursdayBoots.com', notes: 'Goodyear welt. Versatile. Dress up or down. TTS', link: 'https://thursdayboots.com/products/mens-captain-lace-up-boot' },
                      { id: 'shoe-3', name: 'Allen Edmonds Park Avenue (Black)', price: '$425', where: 'AllenEdmonds.com', notes: 'Cap-toe oxford. Formal standard. Recraftable. Size down 0.5', link: 'https://www.allenedmonds.com/shoes/park-avenue/' },
                      { id: 'shoe-4', name: 'Clarks Desert Boot (Beeswax)', price: '$150', where: 'Clarks.com, Amazon', notes: 'Casual classic. Crepe sole. Break-in required. TTS', link: 'https://www.clarksusa.com/c/mens-boots' },
                      { id: 'shoe-5', name: 'Nike Pegasus 40 (Black/White)', price: '$140', where: 'Nike.com, Dick\'s', notes: 'Running/gym. Cushioned. Versatile color. Go up 0.5 size', link: 'https://www.nike.com/w/mens-running-shoes-37v7jznik1zy7ok' },
                    ].map((item) => {
                      const isExpanded = expandedWhy[item.id];
                      return (
                        <div key={item.id} className="bg-white border-2 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleWardrobeItem(item.id)}
                            className={`w-full flex items-center justify-between p-3 transition-all ${
                              wardrobeItems[item.id]
                                ? 'bg-green-50 border-green-500'
                                : 'bg-red-50'
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              {wardrobeItems[item.id] ? (
                                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                              ) : (
                                <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                              )}
                              <span className="text-sm font-medium text-gray-800 text-left">{item.name}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWhy(item.id);
                              }}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Info className="w-4 h-4 text-gray-600" />
                            </button>
                          </button>
                          {isExpanded && (
                            <div className="p-3 bg-gray-50 border-t text-sm space-y-2">
                              <p><strong>Price:</strong> {item.price}</p>
                              <p><strong>Where to buy:</strong> {item.where}</p>
                              <p><strong>Notes:</strong> {item.notes}</p>
                              <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-block px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs font-medium">
                                Shop Now →
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Outerwear */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="w-1 h-6 bg-green-500"></div>
                    Outerwear
                  </h4>
                  <div className="space-y-2">
                    {[
                      { id: 'outer-0', name: 'Schott Perfecto 618 Leather Jacket (Black)', price: '$850', where: 'SchottNYC.com', notes: 'Iconic moto jacket. Lifetime piece. Fits snug initially', link: 'https://www.schottnyc.com/products/perfecto-leather-motorcycle-jacket.htm' },
                      { id: 'outer-1', name: 'Levi\'s Trucker Jacket (Medium Stonewash)', price: '$98', where: 'Levi.com, Amazon', notes: 'Classic denim. Timeless. Size up for layering', link: 'https://www.levi.com/US/en_US/clothing/men/outerwear/c/levi_clothing_men_outerwear' },
                      { id: 'outer-2', name: 'Alpha Industries MA-1 Bomber (Black)', price: '$175', where: 'AlphaIndustries.com', notes: 'Slim fit. Nylon shell. Orange lining. TTS', link: 'https://www.alphaindustries.com/collections/mens-flight-jackets' },
                      { id: 'outer-3', name: 'Canada Goose Chateau Parka (Black)', price: '$1,050', where: 'CanadaGoose.com', notes: 'Rated to -25°C. Premium down. Investment winter coat', link: 'https://www.canadagoose.com/us/en/mens-jackets-and-vests/c/mens-jackets-and-vests' },
                      { id: 'outer-4', name: 'Patagonia Torrentshell 3L (Navy)', price: '$179', where: 'Patagonia.com, REI', notes: 'Waterproof. Packable. Lifetime warranty. TTS', link: 'https://www.patagonia.com/shop/mens-jackets-vests' },
                      { id: 'outer-5', name: 'Suitsupply Havana Blazer (Navy)', price: '$469', where: 'Suitsupply.com', notes: 'Half-canvas. Wool. Dress up or down. Tailoring included', link: 'https://suitsupply.com/en-us/men/suits' },
                      { id: 'outer-6', name: 'J.Crew Ludlow Blazer (Charcoal)', price: '$425', where: 'JCrew.com', notes: 'Slim fit. Italian wool. Versatile gray', link: 'https://www.jcrew.com/r/search/?N=0&Nloc=en&Ntrm=ludlow%20blazer' },
                    ].map((item) => {
                      const isExpanded = expandedWhy[item.id];
                      return (
                        <div key={item.id} className="bg-white border-2 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleWardrobeItem(item.id)}
                            className={`w-full flex items-center justify-between p-3 transition-all ${
                              wardrobeItems[item.id]
                                ? 'bg-green-50 border-green-500'
                                : 'bg-red-50'
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              {wardrobeItems[item.id] ? (
                                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                              ) : (
                                <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                              )}
                              <span className="text-sm font-medium text-gray-800 text-left">{item.name}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWhy(item.id);
                              }}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Info className="w-4 h-4 text-gray-600" />
                            </button>
                          </button>
                          {isExpanded && (
                            <div className="p-3 bg-gray-50 border-t text-sm space-y-2">
                              <p><strong>Price:</strong> {item.price}</p>
                              <p><strong>Where to buy:</strong> {item.where}</p>
                              <p><strong>Notes:</strong> {item.notes}</p>
                              <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-block px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs font-medium">
                                Shop Now →
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Accessories */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="w-1 h-6 bg-yellow-500"></div>
                    Accessories
                  </h4>
                  <div className="space-y-2">
                    {[
                      { id: 'acc-0', name: 'Timex Weekender (Navy Strap)', price: '$45', where: 'Amazon, Target', notes: 'Casual everyday watch. Easy-read. Interchangeable straps', link: 'https://www.timex.com/browse/collections/weekender/' },
                      { id: 'acc-1', name: 'Orient Bambino (Black Dial)', price: '$270', where: 'Amazon, LongIslandWatch', notes: 'Automatic movement. Dress watch. Leather strap. Classic', link: 'https://www.orientwatchusa.com/' },
                      { id: 'acc-2', name: 'Anson Belt & Buckle (Brown)', price: '$68', where: 'AnsonBelt.com', notes: 'Micro-adjustable. Interchangeable buckles. Full grain leather', link: 'https://ansonbelt.com/' },
                      { id: 'acc-3', name: 'Anson Belt & Buckle (Black)', price: '$68', where: 'AnsonBelt.com', notes: 'Same as brown. Essential for formal wear', link: 'https://ansonbelt.com/' },
                      { id: 'acc-4', name: 'Ray-Ban Wayfarer (RB2140)', price: '$163', where: 'Ray-Ban.com, Sunglass Hut', notes: 'Classic shape. 50mm or 54mm width. Black or tortoise', link: 'https://www.ray-ban.com/usa/sunglasses/RB2140%20UNISEX%20wayfarer%20classic-black/805289126577' },
                      { id: 'acc-5', name: 'New Era 9FORTY Cap (Black)', price: '$32', where: 'NewEraCap.com, Lids', notes: 'Adjustable. Clean minimal. No loud logos', link: 'https://www.neweracap.com/collections/9forty' },
                      { id: 'acc-6', name: 'Herschel Little America Backpack (Black)', price: '$120', where: 'Herschel.com, Nordstrom', notes: '25L capacity. Laptop sleeve. Durable. Signature striped lining', link: 'https://herschel.com/shop/backpacks' },
                      { id: 'acc-7', name: 'Fossil Defender Messenger Bag (Brown)', price: '$178', where: 'Fossil.com', notes: 'Full-grain leather. Laptop compartment. Ages beautifully', link: 'https://www.fossil.com/en-us/bags/mens-bags/' },
                    ].map((item) => {
                      const isExpanded = expandedWhy[item.id];
                      return (
                        <div key={item.id} className="bg-white border-2 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleWardrobeItem(item.id)}
                            className={`w-full flex items-center justify-between p-3 transition-all ${
                              wardrobeItems[item.id]
                                ? 'bg-green-50 border-green-500'
                                : 'bg-red-50'
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              {wardrobeItems[item.id] ? (
                                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                              ) : (
                                <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                              )}
                              <span className="text-sm font-medium text-gray-800 text-left">{item.name}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWhy(item.id);
                              }}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Info className="w-4 h-4 text-gray-600" />
                            </button>
                          </button>
                          {isExpanded && (
                            <div className="p-3 bg-gray-50 border-t text-sm space-y-2">
                              <p><strong>Price:</strong> {item.price}</p>
                              <p><strong>Where to buy:</strong> {item.where}</p>
                              <p><strong>Notes:</strong> {item.notes}</p>
                              <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-block px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs font-medium">
                                Shop Now →
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Outfit Combinations */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Pre-Made Outfit Combos</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Casual Date */}
                  <div className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-rose-200 rounded-xl p-4">
                    <h4 className="font-bold text-rose-900 mb-2">Casual Date</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• White T-Shirt</li>
                      <li>• Dark Jeans</li>
                      <li>• White Sneakers</li>
                      <li>• Denim Jacket (optional)</li>
                      <li>• Watch - Casual</li>
                    </ul>
                  </div>

                  {/* Business Casual */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
                    <h4 className="font-bold text-blue-900 mb-2">Business Casual</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• Light Blue Dress Shirt</li>
                      <li>• Chinos - Navy</li>
                      <li>• Brown Leather Boots</li>
                      <li>• Leather Belt - Brown</li>
                      <li>• Watch - Dress</li>
                    </ul>
                  </div>

                  {/* Gym/Active */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                    <h4 className="font-bold text-green-900 mb-2">Gym/Active</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• Black T-Shirt</li>
                      <li>• Shorts - Navy</li>
                      <li>• Running Shoes</li>
                      <li>• Baseball Cap</li>
                      <li>• Backpack</li>
                    </ul>
                  </div>

                  {/* Night Out */}
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200 rounded-xl p-4">
                    <h4 className="font-bold text-purple-900 mb-2">Night Out</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• Black T-Shirt</li>
                      <li>• Black Jeans</li>
                      <li>• Black Sneakers</li>
                      <li>• Black Jacket</li>
                      <li>• Watch - Dress</li>
                    </ul>
                  </div>

                  {/* Smart Casual */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4">
                    <h4 className="font-bold text-amber-900 mb-2">Smart Casual</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• Black Polo</li>
                      <li>• Chinos - Khaki</li>
                      <li>• Casual Loafers</li>
                      <li>• Leather Belt - Brown</li>
                      <li>• Sunglasses</li>
                    </ul>
                  </div>

                  {/* Formal */}
                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-300 rounded-xl p-4">
                    <h4 className="font-bold text-gray-900 mb-2">Formal</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• White Dress Shirt</li>
                      <li>• Black Dress Pants</li>
                      <li>• Black Dress Shoes</li>
                      <li>• Blazer - Navy</li>
                      <li>• Watch - Dress</li>
                      <li>• Leather Belt - Black</li>
                    </ul>
                  </div>

                  {/* Weekend Casual */}
                  <div className="bg-gradient-to-br from-cyan-50 to-sky-50 border-2 border-cyan-200 rounded-xl p-4">
                    <h4 className="font-bold text-cyan-900 mb-2">Weekend Casual</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• Gray Henley</li>
                      <li>• Light Jeans</li>
                      <li>• White Sneakers</li>
                      <li>• Bomber Jacket</li>
                      <li>• Backpack</li>
                    </ul>
                  </div>

                  {/* Cold Weather */}
                  <div className="bg-gradient-to-br from-slate-50 to-zinc-50 border-2 border-slate-300 rounded-xl p-4">
                    <h4 className="font-bold text-slate-900 mb-2">Cold Weather</h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• Black Sweater</li>
                      <li>• Dark Jeans</li>
                      <li>• Brown Leather Boots</li>
                      <li>• Winter Coat</li>
                      <li>• Watch - Casual</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Style Rules */}
              <div className="bg-black text-white p-4 rounded-lg">
                <h3 className="font-bold mb-3 text-lg">Universal Style Rules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="font-semibold mb-1">✓ Always:</p>
                    <ul className="space-y-1 opacity-90">
                      <li>• Fit > Brand (tailored = expensive-looking)</li>
                      <li>• Match belt with shoes</li>
                      <li>• Keep shoes clean</li>
                      <li>• Stick to neutral colors</li>
                      <li>• Iron/steam wrinkles</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">✗ Never:</p>
                    <ul className="space-y-1 opacity-90">
                      <li>• Brown shoes + black pants</li>
                      <li>• Graphic tees (unless gym)</li>
                      <li>• Cargo shorts/pants</li>
                      <li>• More than 3 colors per outfit</li>
                      <li>• Baggy or too-tight clothes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Full-Screen Calendar Modal */}
      {calendarModalTask && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
                  {calendarModalTask.task}
                </h2>
                <p className="text-sm text-gray-600">Track your completion history</p>
              </div>
              <button
                onClick={() => setCalendarModalTask(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Calendar Content */}
            <div className="p-4 sm:p-6">
              {/* Month Selector */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Select Month:</label>
                <select
                  value={selectedMonth[calendarModalTask.id] || new Date().toISOString().slice(0, 7)}
                  onChange={(e) => setSelectedMonth(prev => ({ ...prev, [calendarModalTask.id]: e.target.value }))}
                  className="w-full sm:w-auto px-4 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  {Array.from({ length: 12 }, (_, i) => {
                    const year = new Date().getFullYear();
                    const month = String(i + 1).padStart(2, '0');
                    const monthName = new Date(year, i).toLocaleDateString('en-US', { month: 'long' });
                    return (
                      <option key={`${year}-${month}`} value={`${year}-${month}`}>
                        {monthName} {year}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Calendar Grid */}
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-2 sm:gap-3">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs sm:text-sm font-semibold text-gray-600 py-2">
                      <span className="hidden sm:inline">{day}</span>
                      <span className="sm:hidden">{day[0]}</span>
                    </div>
                  ))}

                  {(() => {
                    const yearMonth = selectedMonth[calendarModalTask.id] || new Date().toISOString().slice(0, 7);
                    const [year, month] = yearMonth.split('-').map(Number);
                    const firstDay = new Date(year, month - 1, 1).getDay();
                    const daysInMonth = getDaysInMonth(yearMonth);
                    const days = [];

                    for (let i = 0; i < firstDay; i++) {
                      days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
                    }

                    for (let day = 1; day <= daysInMonth; day++) {
                      const dateStr = `${yearMonth}-${String(day).padStart(2, '0')}`;
                      const isCompleted = isDateCompleted(calendarModalTask.id, dateStr);
                      const isToday = dateStr === new Date().toISOString().slice(0, 10);

                      days.push(
                        <button
                          key={day}
                          onClick={() => toggleDateCompletion(calendarModalTask.id, dateStr)}
                          className={`aspect-square rounded-lg font-semibold text-sm sm:text-base transition-all flex flex-col items-center justify-center ${
                            isCompleted
                              ? 'bg-green-500 text-white shadow-md hover:bg-green-600'
                              : isToday
                              ? 'bg-blue-100 border-2 border-blue-500 text-blue-700 hover:bg-blue-200'
                              : 'bg-gray-50 border-2 border-gray-200 text-gray-700 hover:border-green-300 hover:bg-gray-100'
                          }`}
                        >
                          <span>{day}</span>
                          {isCompleted && <Check className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5" />}
                        </button>
                      );
                    }
                    return days;
                  })()}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-green-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-700">Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-blue-100 border-2 border-blue-500"></div>
                    <span className="text-sm text-gray-700">Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gray-50 border-2 border-gray-200"></div>
                    <span className="text-sm text-gray-700">Not completed</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-200">
                  {(() => {
                    const yearMonth = selectedMonth[calendarModalTask.id] || new Date().toISOString().slice(0, 7);
                    const daysInMonth = getDaysInMonth(yearMonth);
                    const completedDays = Array.from({ length: daysInMonth }, (_, i) => {
                      const day = i + 1;
                      const dateStr = `${yearMonth}-${String(day).padStart(2, '0')}`;
                      return isDateCompleted(calendarModalTask.id, dateStr);
                    }).filter(Boolean).length;
                    const percentage = Math.round((completedDays / daysInMonth) * 100);

                    return (
                      <>
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-blue-600">{completedDays}</div>
                          <div className="text-xs text-gray-600">Completed</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-gray-600">{daysInMonth - completedDays}</div>
                          <div className="text-xs text-gray-600">Remaining</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-green-600">{percentage}%</div>
                          <div className="text-xs text-gray-600">Completion</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-purple-600">{daysInMonth}</div>
                          <div className="text-xs text-gray-600">Total Days</div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setCalendarModalTask(null)}
                className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}