import React from 'react';
import { User } from 'lucide-react';

const RetardsTab = ({ vendeurActif, currentSeller, affectations }) => {
  return (
    <div className="divide-y divide-gray-200">
      <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              <span className="font-bold text-[15px] hover:underline">{vendeurActif}</span>
              <svg viewBox="0 0 22 22" className="w-[18px] h-[18px]" fill="#1d9bf0">
                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"/>
              </svg>
              <span className="text-gray-500 text-[15px]">@{vendeurActif.toLowerCase().replace(/\s+/g, '_')}</span>
              <span className="text-gray-500 text-[15px]">· 2h</span>
            </div>
            <div className="text-[15px] leading-5">
              <p className="mb-2">📊 Rapport de performance</p>
              <p className="mb-3">Pompes affectées : <span className="font-bold text-blue-500">{affectations}</span></p>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Quart de travail</p>
                    <p className="font-semibold text-black">{currentSeller.shift}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Retards</p>
                    <p className={`font-semibold ${currentSeller.tardiness > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                      {currentSeller.tardiness}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500 mb-1">Contact</p>
                    <p className="text-blue-500 text-xs">{currentSeller.phone}</p>
                    <p className="text-blue-500 text-xs">{currentSeller.email}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-3 max-w-md text-gray-500">
              <button className="flex items-center gap-2 hover:text-blue-500 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-blue-50">
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                </div>
              </button>
              <button className="flex items-center gap-2 hover:text-green-500 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-green-50">
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 1l4 4-4 4"/>
                    <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                    <path d="M7 23l-4-4 4-4"/>
                    <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                  </svg>
                </div>
              </button>
              <button className="flex items-center gap-2 hover:text-pink-500 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-pink-50">
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>
              </button>
              <button className="flex items-center gap-2 hover:text-blue-500 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-blue-50">
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                    <polyline points="16 6 12 2 8 6"/>
                    <line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetardsTab;