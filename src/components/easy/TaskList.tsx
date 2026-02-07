import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onDelete, onToggleComplete, vendeurs }) => {
  if (tasks.length === 0) {
    return (
      <div className="p-4 bg-white border rounded text-center">
        <p className="text-sm text-gray-500">No tasks found</p>
        <p className="text-xs text-gray-400 mt-1">Add your first task</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          vendeurs={vendeurs}
        />
      ))}
    </div>
  );
};

export default TaskList;