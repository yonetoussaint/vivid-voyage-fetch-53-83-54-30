import React from 'react';

const ACCENT_MAP = {
  emerald: '#4ade80',
  amber:   '#fbbf24',
  red:     '#f87171',
  orange:  '#fb923c',
  blue:    '#60a5fa',
};

const StatisticCard = ({
  title,
  value,
  color = 'emerald',
  unit = 'gallons',
}) => {
  const accent = ACCENT_MAP[color] || ACCENT_MAP.emerald;

  return (
    <div style={{
      background: '#07090b',
      border: '1px solid #1a1a1a',
      padding: '10px 14px 12px',
      fontFamily: "'Courier New', Courier, monospace",
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: accent,
          flexShrink: 0,
        }} />
        <span style={{
          fontSize: 9,
          color: '#444',
          letterSpacing: 1.1,
          textTransform: 'uppercase',
        }}>
          {title}
        </span>
      </div>

      {/* Value + unit row */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
        <span style={{
          fontSize: 22,
          fontWeight: 700,
          color: '#d4d4d8',
          letterSpacing: -0.5,
          lineHeight: 1,
        }}>
          {value}
        </span>
        <span style={{
          fontSize: 9,
          color: accent,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          borderLeft: `1px solid ${accent}33`,
          paddingLeft: 8,
        }}>
          {unit}
        </span>
      </div>
    </div>
  );
};

export default StatisticCard;
