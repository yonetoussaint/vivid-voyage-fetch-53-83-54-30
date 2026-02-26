import React from 'react';

const F = "'DM Mono', 'Fira Mono', monospace";

const ACCENT_MAP = {
  emerald: '#059669',
  amber:   '#d97706',
  red:     '#dc2626',
  orange:  '#ea580c',
  blue:    '#2563eb',
};

const StatisticCard = ({ title, value, color = 'emerald', unit = 'gallons' }) => {
  const accent = ACCENT_MAP[color] || ACCENT_MAP.emerald;

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');`}</style>
      <div style={{
        background: '#ffffff',
        border: '1px solid #e8e8e8',
        padding: '11px 14px 13px',
        fontFamily: F,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: accent, flexShrink: 0 }} />
          <span style={{ fontSize: 9, color: '#888', letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 400 }}>
            {title}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 24, fontWeight: 500, color: '#0a0a0a', letterSpacing: -0.8, lineHeight: 1 }}>
            {value}
          </span>
          <span style={{
            fontSize: 9, color: accent, letterSpacing: 0.8, textTransform: 'uppercase',
            borderLeft: `1px solid ${accent}44`, paddingLeft: 9,
          }}>
            {unit}
          </span>
        </div>
      </div>
    </>
  );
};

export default StatisticCard;
