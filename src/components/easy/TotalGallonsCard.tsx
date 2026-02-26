import React from 'react';
import { formaterGallons } from '@/utils/formatters';

const F = "'DM Mono', 'Fira Mono', monospace";

const TotalGallonsCard = ({ gallonsEssence, gallonsDiesel, isPropane = false, pompe = '', accent = '#4f46e5' }) => {
  const dotColor    = isPropane ? '#ef4444' : accent;
  const totalGallons = isPropane ? gallonsDiesel : gallonsEssence + gallonsDiesel;
  const totalLabel   = isPropane ? gallonsDiesel.toFixed(3) : formaterGallons(totalGallons);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');`}</style>
      <div style={{ fontFamily: F, border: '1px solid #e8e8e8', background: '#ffffff', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
          <span style={{ fontSize: 9, color: '#888', letterSpacing: 1.1, textTransform: 'uppercase' }}>
            {isPropane ? `Gallons propane · ${pompe || 'Propane'}` : 'Total gallons · Essence + Diesel'}
          </span>
        </div>

        {/* Main value */}
        <div style={{
          padding: '12px 14px',
          borderBottom: !isPropane ? '1px solid #f0f0f0' : 'none',
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 26, fontWeight: 500, color: '#0a0a0a', letterSpacing: -1, lineHeight: 1 }}>
            {totalLabel}
          </span>
          <span style={{ fontSize: 9, color: dotColor, letterSpacing: 0.8, textTransform: 'uppercase', borderLeft: `1px solid ${dotColor}33`, paddingLeft: 9 }}>
            {isPropane ? 'gal propane' : 'gal totaux'}
          </span>
        </div>

        {/* Breakdown */}
        {!isPropane && (
          <div style={{ padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ fontSize: 9, color: '#c0c0c0', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 2 }}>Détail</span>
            {[
              { label: 'Essence', value: formaterGallons(gallonsEssence), color: '#059669' },
              { label: 'Diesel',  value: formaterGallons(gallonsDiesel),  color: '#d97706' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 9, color: '#888', letterSpacing: 0.6 }}>{label}</span>
                </div>
                <span style={{ fontSize: 9, color: '#555', letterSpacing: 0.4 }}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TotalGallonsCard;
