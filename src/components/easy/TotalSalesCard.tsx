import React from 'react';
import { formaterArgent, formaterCaisse } from '@/utils/formatters';

const TotalSalesCard = ({
  ventesTotales,
  isPropane = false,
  pompe = '',
  accent = '#7a7aff',
}) => {
  const exactValue  = parseFloat(ventesTotales || 0);
  const rawRounded  = formaterCaisse(ventesTotales || 0);
  const roundedValue = parseFloat(rawRounded.replace(/'/g, '').replace(/\s/g, ''));
  const adjustment  = roundedValue - exactValue;
  const hasAdjustment = Math.abs(adjustment) > 0.001;
  const isRoundedUp   = adjustment > 0;

  const productLabel = isPropane ? 'Propane' : pompe;
  const dotColor     = isPropane ? '#f87171' : accent;

  return (
    <div style={{
      fontFamily: "'Courier New', Courier, monospace",
      border: '1px solid #1a1a1a',
      background: '#07090b',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 14px',
        borderBottom: '1px solid #111',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
          <span style={{ fontSize: 9, color: '#444', letterSpacing: 1.1, textTransform: 'uppercase' }}>
            Total Ventes · {productLabel}
          </span>
        </div>
        <span style={{ fontSize: 9, color: '#2a2a2a', letterSpacing: 0.8, textTransform: 'uppercase' }}>
          Final
        </span>
      </div>

      {/* ── Brut ── */}
      <div style={{
        padding: '12px 14px',
        borderBottom: '1px solid #111',
      }}>
        <div style={{ fontSize: 9, color: '#333', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 }}>
          {isPropane ? 'Ventes brutes propane' : 'Ventes brutes — Essence + Diesel'}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: '#d4d4d8', letterSpacing: -0.5, lineHeight: 1 }}>
            {formaterArgent(ventesTotales)}
          </span>
          <span style={{ fontSize: 9, color: '#333', letterSpacing: 0.8, textTransform: 'uppercase' }}>HTG</span>
        </div>
      </div>

      {/* ── Adjusted / Caisse ── */}
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ fontSize: 9, color: '#333', letterSpacing: 0.8, textTransform: 'uppercase' }}>
            Total ajusté — Caisse
          </div>
          <div style={{ fontSize: 9, color: '#2a2a2a', letterSpacing: 0.6, fontStyle: 'italic' }}>
            arrondi au 0 ou 5
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: dotColor, letterSpacing: -0.5, lineHeight: 1 }}>
            {formaterCaisse(ventesTotales)}
          </span>
          <span style={{ fontSize: 9, color: dotColor + '88', letterSpacing: 0.8, textTransform: 'uppercase',
            borderLeft: `1px solid ${dotColor}33`, paddingLeft: 8 }}>
            HTG
          </span>
        </div>

        {hasAdjustment && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 8,
            borderTop: '1px solid #111',
          }}>
            <span style={{ fontSize: 9, color: '#2a2a2a', letterSpacing: 0.6 }}>Écart d'arrondi</span>
            <span style={{
              fontSize: 9,
              color: isRoundedUp ? '#fbbf24' : '#60a5fa',
              letterSpacing: 0.5,
              fontWeight: 600,
            }}>
              {isRoundedUp ? '+' : ''}{adjustment.toFixed(2)}
            </span>
          </div>
        )}
      </div>

    </div>
  );
};

export default TotalSalesCard;
