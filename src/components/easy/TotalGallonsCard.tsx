import React from 'react';
import { formaterGallons } from '@/utils/formatters';

const TotalGallonsCard = ({
  gallonsEssence,
  gallonsDiesel,
  isPropane = false,
  pompe = '',
  accent = '#7a7aff',
}) => {
  const dotColor    = isPropane ? '#f87171' : accent;
  const totalGallons = isPropane ? gallonsDiesel : gallonsEssence + gallonsDiesel;
  const totalLabel   = isPropane
    ? gallonsDiesel.toFixed(3)
    : formaterGallons(totalGallons);

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
        gap: 7,
        padding: '8px 14px',
        borderBottom: '1px solid #111',
      }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
        <span style={{ fontSize: 9, color: '#444', letterSpacing: 1.1, textTransform: 'uppercase' }}>
          {isPropane ? `Gallons propane · ${pompe || 'Propane'}` : `Total gallons · Essence + Diesel`}
        </span>
      </div>

      {/* ── Main value ── */}
      <div style={{
        padding: '12px 14px',
        borderBottom: !isPropane ? '1px solid #111' : 'none',
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontSize: 26, fontWeight: 700, color: '#d4d4d8',
          letterSpacing: -0.5, lineHeight: 1,
        }}>
          {totalLabel}
        </span>
        <span style={{
          fontSize: 9, color: dotColor + '88', letterSpacing: 0.8,
          textTransform: 'uppercase', borderLeft: `1px solid ${dotColor}33`, paddingLeft: 8,
        }}>
          {isPropane ? 'gal propane' : 'gal totaux'}
        </span>
      </div>

      {/* ── Breakdown (fuel only) ── */}
      {!isPropane && (
        <div style={{
          padding: '8px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
        }}>
          <span style={{ fontSize: 9, color: '#2a2a2a', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 2 }}>
            Détail
          </span>
          {[
            { label: 'Essence', value: formaterGallons(gallonsEssence), color: '#4ade80' },
            { label: 'Diesel',  value: formaterGallons(gallonsDiesel),  color: '#fbbf24' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontSize: 9, color: '#444', letterSpacing: 0.6 }}>{label}</span>
              </div>
              <span style={{ fontSize: 9, color: '#666', letterSpacing: 0.4 }}>{value}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default TotalGallonsCard;
