// Rename this file to Daily.jsx or Daily.tsx

import { useState, useEffect } from 'react';
import { CalendarTab } from '@/components/easy/CalendarTab';
import { NotesTab } from '@/components/easy/NotesTab';
import { MoneyTab } from '@/components/easy/MoneyTab';
import { TaskDetailScreen } from '@/components/easy/TaskDetailScreen';
import { registerOpenDetail } from '@/components/easy/EventCard';
import SystemeStationService from '@/pages/EasyPlus';

// Wrap with necessary providers if this component needs auth
import { AuthProvider } from '@/hooks/useAuth';
import { AuthOverlayProvider } from '@/context/AuthOverlayContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/utils/queryClient';

export default function Daily() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [detailCtx, setDetailCtx] = useState(null);

  useEffect(() => {
    registerOpenDetail((ctx) => setDetailCtx(ctx));
    return () => registerOpenDetail(null);
  }, []);

  const TABS = [
    {
      id: "notes",
      label: "Notes",
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?"#4285f4":"#555"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          <line x1="9" y1="9" x2="15" y2="9"/>
          <line x1="9" y1="13" x2="13" y2="13"/>
        </svg>
      ),
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?"#4285f4":"#555"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
    {
      id: "money",
      label: "Money",
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?"#ef5350":"#555"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="20" height="13" rx="2"/>
          <path d="M2 10h20"/>
          <circle cx="12" cy="15" r="2"/>
        </svg>
      ),
    },
    {
      id: "easyplus",
      label: "EasyPlus",
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?"#34A853":"#555"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
      ),
    },
  ];

  // Wrap the component content with necessary providers
  const ComponentContent = () => (
    <>
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
          background: #1a1a1a;
          font-family: 'Roboto', sans-serif;
        }

        .app-outer {
          width: 100%;
          height: 100%;
        }

        .app-shell {
          width: 100vw;
          height: 100dvh;
          background: #000;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          color: #fff;
        }

        @media (min-width: 480px) {
          .app-outer {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100vw;
          }
          .app-shell {
            width: 390px;
            height: 844px;
            box-shadow: 0 0 40px rgba(0,0,0,0.6);
            border-radius: 40px;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        div::-webkit-scrollbar, input::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="app-outer">
        <div className="app-shell">
          <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
            {activeTab === "notes"    && <NotesTab />}
            {activeTab === "calendar" && <CalendarTab />}
            {activeTab === "money"    && <MoneyTab />}
            {activeTab === "easyplus" && <SystemeStationService />}
          </div>

          <div style={{
            display: "flex",
            flexShrink: 0,
            borderTop: "1px solid #111",
            background: "#000",
            paddingBottom: "env(safe-area-inset-bottom, 8px)",
          }}>
            {TABS.map(tab => {
              const active = activeTab === tab.id;
              return (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    padding: "10px 0 6px",
                    cursor: "pointer",
                    userSelect: "none",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  {tab.icon(active)}
                  <span style={{
                    fontSize: 10,
                    color: active ? "#4285f4" : "#555",
                    fontWeight: active ? 600 : 400,
                    letterSpacing: 0.3,
                  }}>
                    {tab.label}
                  </span>
                  {active && (
                    <div style={{ width: 20, height: 2, borderRadius: 1, background: "#4285f4", marginTop: 1 }} />
                  )}
                </div>
              );
            })}
          </div>

          {detailCtx && (
            <TaskDetailScreen
              ev={detailCtx.ev}
              dateKey={detailCtx.dateKey}
              year={detailCtx.year}
              month={detailCtx.month}
              onClose={() => setDetailCtx(null)}
              bump={() => detailCtx.bump && detailCtx.bump()}
            />
          )}
        </div>
      </div>
    </>
  );

  // If the component needs auth, wrap it with providers
  // Otherwise, just return the content directly
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthOverlayProvider>
          <ComponentContent />
        </AuthOverlayProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}