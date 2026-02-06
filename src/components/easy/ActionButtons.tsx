import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const ActionButtons = () => {
  return (
    <div className="px-4 flex justify-end gap-2 pt-3">
      <button className="hover:bg-gray-100 rounded-full p-2 border border-gray-300 transition-colors">
        <MoreHorizontal className="w-5 h-5" />
      </button>
      <button className="bg-black text-white font-bold px-4 py-[7px] rounded-full text-[15px] hover:bg-gray-800 transition-colors">
        Suivre
      </button>
    </div>
  );
};

export default ActionButtons;