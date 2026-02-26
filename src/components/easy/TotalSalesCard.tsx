import React from 'react';
import { formaterArgent, formaterCaisse } from '@/utils/formatters';

const F = "'DM Mono', 'Fira Mono', monospace";

const TotalSalesCard = ({ ventesTotales, isPropane = false, pompe = '', accent = '#4f46e5' }) => {
  const exactValue   = parseFloat(ventesTotales || 0);
  const rawRounded   = formaterCaisse(ventesTotales || 0);
  const roundedValue = parseFloat(rawRounded.replace(/'/g, '').replace(/\s/g, ''));
  const adjustment   = roundedValue - exactValue;
  const hasAdjustment = Math.abs(adjustment) > 0.001;
  const isRoundedUp   = adjustment > 0;
  const dotColor      = isPropane ? '#ef4444' : accent;
  const productLabel  = isPropane ? 'Propane' : pompe;

  const Row = ({ label, children }) => (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 9, color: '#a0a0a0', letterSpacing: 0.8, textTransform: 'uppercase' }}>{label}</span>
      {children}
    </div>
  );

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');`}</style>
      <div style={{ fontFamily: F, border: '1px solid #e8e8e8', background: '#ffffff', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: dotColor }} />
            <span style={{ fontSize: 9, color: '#888', letterSpacing: 1.1, textTransform: 'uppercase' }}>
              Total Ventes · {productLabel}
            </span>
          </div>
          <span style={{ fontSize: 9, color: '#c8c8c8', letterSpacing: 0.8, textTransform: 'uppercase' }}>Final</span>
        </div>

        {/* Brut */}
        <div style={{ padding: '12px 14px', borderBottom: '1px solid #f0f0f0' }}>
          <span style={{ fontSize: 9, color: '#b0b0b0', letterSpacing: 0.8, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
            {isPropane ? 'Ventes brutes propane' : 'Ventes brutes — Essence + Diesel'}
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 26, fontWeight: 500, color: '#0a0a0a', letterSpacing: -1, lineHeight: 1 }}>
              {formaterArgent(ventesTotales)}
            </span>
            <span style={{ fontSize: 9, color: '#c0c0c0', letterSpacing: 0.8, textTransform: 'uppercase' }}>HTG</span>
          </div>
        </div>

        {/* Adjusted */}
        <div style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 9, color: '#b0b0b0', letterSpacing: 0.8, textTransform: 'uppercase' }}>Total ajusté — Caisse</span>
            <span style={{ fontSize: 9, color: '#d0d0d0', letterSpacing: 0.4, fontStyle: 'italic' }}>arrondi au 0 ou 5</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 26, fontWeight: 500, color: dotColor, letterSpacing: -1, lineHeight: 1 }}>
              {formaterCaisse(ventesTotales)}
            </span>
            <span style={{ fontSize: 9, color: dotColor + '88', letterSpacing: 0.8, textTransform: 'uppercase', borderLeft: `1px solid ${dotColor}33`, paddingLeft: 9 }}>
              HTG
            </span>
          </div>

          {hasAdjustment && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: 9, color: '#c0c0c0', letterSpacing: 0.6 }}>Écart d'arrondi</span>
              <span style={{ fontSize: 9, color: isRoundedUp ? '#d97706' : '#2563eb', fontWeight: 500 }}>
                {isRoundedUp ? '+' : ''}{adjustment.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TotalSalesCard;
