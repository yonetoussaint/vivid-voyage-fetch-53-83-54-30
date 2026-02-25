import React from 'react';

const SIZE = {
  sm: { fontSize: 9,  padding: '3px 8px',  gap: 5 },
  md: { fontSize: 10, padding: '4px 12px', gap: 6 },
  lg: { fontSize: 11, padding: '6px 16px', gap: 7 },
};

const TabSelector = ({
  tabs = [],
  activeTab,
  onTabChange,
  size = 'md',
  showBadges = false,
  containerClassName = '',
  showPropane = false,
  propaneId = 'propane',
  propaneLabel = 'Propane',
  onPropaneClick,
  accent = '#7a7aff',
}) => {
  const s = SIZE[size] || SIZE.md;
  const propaneAccent = '#f87171';

  const tabStyle = (isActive, color) => ({
    display: 'flex',
    alignItems: 'center',
    gap: s.gap,
    padding: s.padding,
    fontSize: s.fontSize,
    fontFamily: "'Courier New', Courier, monospace",
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    border: `1px solid ${isActive ? (color || accent) + '55' : '#1a1a1a'}`,
    background: isActive ? (color || accent) + '0d' : 'transparent',
    color: isActive ? (color || accent) : '#444',
    cursor: 'pointer',
    transition: 'color 0.12s, border-color 0.12s, background 0.12s',
    outline: 'none',
    flexShrink: 0,
  });

  const hoverOn  = (e, color) => {
    e.currentTarget.style.color       = color || accent;
    e.currentTarget.style.borderColor = (color || accent) + '55';
    e.currentTarget.style.background  = (color || accent) + '0d';
  };
  const hoverOff = (e, isActive, color) => {
    e.currentTarget.style.color       = isActive ? (color || accent) : '#444';
    e.currentTarget.style.borderColor = isActive ? (color || accent) + '55' : '#1a1a1a';
    e.currentTarget.style.background  = isActive ? (color || accent) + '0d' : 'transparent';
  };

  return (
    <div style={{
      display: 'flex',
      gap: 4,
      overflowX: 'auto',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      padding: '0 2px 2px',
    }}
      className={containerClassName}
    >
      {tabs.map((tab, i) => {
        const isActive = activeTab === tab.id;
        const color    = tab.accentColor || null;
        return (
          <button
            key={tab.id ?? i}
            onClick={() => onTabChange(tab.id)}
            style={tabStyle(isActive, color)}
            onMouseEnter={e => !isActive && hoverOn(e, color)}
            onMouseLeave={e => hoverOff(e, isActive, color)}
          >
            {tab.icon && (
              <span style={{ display: 'flex', alignItems: 'center', opacity: isActive ? 1 : 0.5 }}>
                {tab.icon}
              </span>
            )}
            {tab.label}
            {showBadges && tab.badge !== undefined && (
              <span style={{
                fontSize: s.fontSize - 1,
                color: isActive ? (color || accent) : '#333',
                borderLeft: `1px solid ${isActive ? (color || accent) + '44' : '#1e1e1e'}`,
                paddingLeft: 6,
                marginLeft: 2,
              }}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}

      {showPropane && (() => {
        const isActive = activeTab === propaneId;
        return (
          <button
            onClick={() => onPropaneClick ? onPropaneClick() : onTabChange(propaneId)}
            style={tabStyle(isActive, propaneAccent)}
            onMouseEnter={e => !isActive && hoverOn(e, propaneAccent)}
            onMouseLeave={e => hoverOff(e, isActive, propaneAccent)}
          >
            <div style={{
              width: 4, height: 4, borderRadius: '50%',
              background: isActive ? propaneAccent : '#444',
              flexShrink: 0,
              transition: 'background 0.12s',
            }} />
            {propaneLabel}
          </button>
        );
      })()}
    </div>
  );
};

export default TabSelector;
