import { useState, useEffect } from 'react';
import { CalendarTab } from '@/components/easy/CalendarTab';
import { NotesTab } from '@/components/easy/NotesTab';
import { MoneyTab } from '@/components/easy/MoneyTab';
import { TaskDetailScreen } from '@/components/easy/TaskDetailScreen';
import { registerOpenDetail } from '@/components/easy/EventCard';
import SystemeStationService from '@/pages/EasyPlus';
import { QuickAuth } from '@/components/QuickAuth';
import { useAuth } from '@/contexts/auth/AuthContext';

export default function SamsungCalendar() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("notes"); // Default to notes tab
  const [detailCtx, setDetailCtx] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    registerOpenDetail((ctx) => setDetailCtx(ctx));
    return () => registerOpenDetail(null);
  }, []);

  // Show auth modal if not logged in and not already showing
  useEffect(() => {
    if (!user && !showAuth) {
      // Small delay to avoid flashing on load
      const timer = setTimeout(() => setShowAuth(true), 500);
      return () => clearTimeout(timer);
    }
  }, [user, showAuth]);

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

  // Get user display info
  const getUserDisplay = () => {
    if (!user) return null;
    return user.email || user.full_name || 'User';
  };

  return (
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
          {/* Header with user info and login button */}
          <div style={{
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #111',
            background: '#000',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#fff', fontSize: 18, fontWeight: 500 }}>Vivid Voyage</span>
              {user && (
                <span style={{
                  background: '#4285f4',
                  color: '#fff',
                  fontSize: 11,
                  padding: '2px 8px',
                  borderRadius: 12,
                }}>
                  {getUserDisplay()}
                </span>
              )}
            </div>
            
            {!user ? (
              <button
                onClick={() => setShowAuth(true)}
                style={{
                  background: '#4285f4',
                  border: 'none',
                  color: '#fff',
                  padding: '6px 16px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#5a9cfe'}
                onMouseLeave={e => e.currentTarget.style.background = '#4285f4'}
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={async () => {
                  const { logout } = useAuth();
                  await logout();
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid #333',
                  color: '#999',
                  padding: '6px 16px',
                  borderRadius: 20,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#111';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#999';
                }}
              >
                Sign Out
              </button>
            )}
          </div>

          {/* Scrollable content area */}
          <div style={{ 
            flex: 1, 
            overflow: "auto", 
            display: "flex", 
            flexDirection: "column",
            opacity: !user && activeTab !== "notes" ? 0.6 : 1,
            pointerEvents: !user && activeTab !== "notes" ? 'none' : 'auto',
          }}>
            {activeTab === "notes" && <NotesTab />}
            {activeTab === "calendar" && (
              !user ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  padding: 20,
                  textAlign: 'center',
                  color: '#666',
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <h3 style={{ margin: '16px 0 8px', color: '#fff' }}>Sign in to access Calendar</h3>
                  <p style={{ margin: 0, fontSize: 14 }}>Save and sync your events across devices</p>
                  <button
                    onClick={() => setShowAuth(true)}
                    style={{
                      marginTop: 20,
                      background: '#4285f4',
                      border: 'none',
                      color: '#fff',
                      padding: '10px 24px',
                      borderRadius: 24,
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Sign In
                  </button>
                </div>
              ) : (
                <CalendarTab />
              )
            )}
            {activeTab === "money" && (
              !user ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  padding: 20,
                  textAlign: 'center',
                  color: '#666',
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
                    <rect x="2" y="6" width="20" height="13" rx="2"/>
                    <path d="M2 10h20"/>
                    <circle cx="12" cy="15" r="2"/>
                  </svg>
                  <h3 style={{ margin: '16px 0 8px', color: '#fff' }}>Sign in to track Money</h3>
                  <p style={{ margin: 0, fontSize: 14 }}>Manage your finances securely</p>
                  <button
                    onClick={() => setShowAuth(true)}
                    style={{
                      marginTop: 20,
                      background: '#4285f4',
                      border: 'none',
                      color: '#fff',
                      padding: '10px 24px',
                      borderRadius: 24,
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Sign In
                  </button>
                </div>
              ) : (
                <MoneyTab />
              )
            )}
            {activeTab === "easyplus" && <SystemeStationService />}
          </div>

          {/* Bottom navigation */}
          <div style={{
            display: "flex",
            flexShrink: 0,
            borderTop: "1px solid #111",
            background: "#000",
            paddingBottom: "env(safe-area-inset-bottom, 8px)",
          }}>
            {TABS.map(tab => {
              const active = activeTab === tab.id;
              // Disable some tabs for non-authenticated users
              const isDisabled = !user && (tab.id === "calendar" || tab.id === "money");
              
              return (
                <div
                  key={tab.id}
                  onClick={() => {
                    if (isDisabled) {
                      setShowAuth(true);
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    padding: "10px 0 6px",
                    cursor: isDisabled ? "pointer" : "pointer",
                    userSelect: "none",
                    WebkitTapHighlightColor: "transparent",
                    opacity: isDisabled ? 0.5 : 1,
                  }}
                >
                  {tab.icon(active && !isDisabled)}
                  <span style={{
                    fontSize: 10,
                    color: (active && !isDisabled) ? "#4285f4" : "#555",
                    fontWeight: (active && !isDisabled) ? 600 : 400,
                    letterSpacing: 0.3,
                  }}>
                    {tab.label}
                  </span>
                  {active && !isDisabled && (
                    <div style={{ width: 20, height: 2, borderRadius: 1, background: "#4285f4", marginTop: 1 }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Auth Modal */}
          {showAuth && (
            <QuickAuth onClose={() => setShowAuth(false)} />
          )}

          {/* Task detail screen */}
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
}