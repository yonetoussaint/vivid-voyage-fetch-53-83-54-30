import React from 'react';

const CursorFollower = ({ theme, cursorPos, cursorVisible }) => {
  return (
    <div
      className={`fixed w-5 h-5 border-2 ${theme === 'dark' ? 'border-[#00ff88]' : 'border-green-600'} rounded-full pointer-events-none z-[9999] transition-transform duration-150 hide-cursor-mobile`}
      style={{
        left: `${cursorPos.x}px`,
        top: `${cursorPos.y}px`,
        opacity: cursorVisible ? 1 : 0
      }}
    />
  );
};

export default CursorFollower;