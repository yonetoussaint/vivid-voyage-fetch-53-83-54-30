import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onDelete, onToggleComplete }) => {
  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No tasks found</p>
        <p className="text-sm mt-1">Add your first task to get started</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
};

export default TaskList;