export const getSampleTasks = (currentDate) => {
  return [
    {
      id: 1,
      title: 'Weekly Staff Meeting',
      description: 'Discuss weekly performance and safety protocols',
      priority: 'high',
      assignedTo: 'Manager',
      dueDate: currentDate,
      dueTime: '09:00',
      shift: 'AM',
      status: 'pending',
      category: 'management',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Check Fire Extinguishers',
      description: 'Monthly inspection of all fire extinguishers',
      priority: 'critical',
      assignedTo: 'All',
      dueDate: currentDate,
      dueTime: '10:00',
      shift: 'AM',
      status: 'pending',
      category: 'safety',
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      title: 'Clean Restrooms',
      description: 'Hourly check and cleaning',
      priority: 'medium',
      assignedTo: 'Attendant',
      dueDate: currentDate,
      dueTime: '11:00',
      shift: 'AM',
      status: 'completed',
      category: 'maintenance',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    }
  ];
};