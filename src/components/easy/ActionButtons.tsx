import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const ActionButtons = () => {
  return (
    <div className="flex gap-2">
      <button className="hover:bg-gray-100 rounded-full p-2 border border-gray-300 transition-colors bg-white/90 backdrop-blur-sm">
        <MoreHorizontal className="w-5 h-5" />
      </button>
      <button className="bg-black text-white font-bold px-4 py-[7px] rounded-full text-[15px] hover:bg-gray-800 transition-colors bg-black/90 backdrop-blur-sm">
        Suivre
      </button>
    </div>
  );
};

export default ActionButtons;