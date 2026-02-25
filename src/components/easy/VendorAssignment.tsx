import React from 'react';

const VendorAssignment = ({
  pompe,
  isPropane,
  vendeurActuel,
  vendeurs,
  handleVendeurChange,
  accent = '#7a7aff',
}) => {
  return (
    <div style={{
      display: 'flex',
      border: '1px solid #1a1a1a',
      background: '#07090b',
      fontFamily: "'Courier New', Courier, monospace",
      overflow: 'hidden',
    }}>
      {/* Left — type label */}
      <div style={{
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        borderRight: '1px solid #1a1a1a',
        flexShrink: 0,
        background: isPropane ? accent + '0d' : 'transparent',
      }}>
        {/* Dot indicator */}
        <div style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: isPropane ? accent : '#333',
          flexShrink: 0,
        }} />
        <span style={{
          fontSize: 10,
          color: isPropane ? accent : '#555',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          fontWeight: isPropane ? 600 : 400,
        }}>
          {isPropane ? 'Propane' : pompe}
        </span>
      </div>

      {/* Right — vendor select */}
      <div style={{ flex: 1, minWidth: 0, position: 'relative', display: 'flex', alignItems: 'center' }}>
        <select
          value={vendeurActuel}
          onChange={e => handleVendeurChange(e.target.value)}
          style={{
            width: '100%',
            height: '100%',
            padding: '6px 28px 6px 12px',
            fontSize: 10,
            letterSpacing: 0.5,
            color: vendeurActuel ? '#aaa' : '#333',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            appearance: 'none',
            WebkitAppearance: 'none',
            fontFamily: "'Courier New', Courier, monospace",
            cursor: 'pointer',
          }}
        >
          <option value="" style={{ background: '#07090b', color: '#333' }}>Vendeur assigné</option>
          {vendeurs.map(v => (
            <option key={v} value={v} style={{ background: '#07090b', color: '#aaa' }}>{v}</option>
          ))}
        </select>

        {/* Trailing icon */}
        <div style={{
          position: 'absolute',
          right: 10,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          color: vendeurActuel ? accent + '99' : '#2a2a2a',
        }}>
          {vendeurActuel ? (
            /* Pen icon */
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          ) : (
            /* Chevron */
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorAssignment;
