// components/easy/CaisseRecuCard.jsx
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { formaterArgent } from '@/utils/formatters';
import { generateChangeCombinations, getMaximumGivableAmount } from '@/utils/changeCalculator';
import ChangeCombinations from './ChangeCombinations';

const S = { fontFamily: "'Courier New', Courier, monospace" };

// ── Shared primitives ────────────────────────────────────────────────────────

const Row = ({ children, style }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...style }}>
    {children}
  </div>
);

const Label = ({ children, style }) => (
  <span style={{ fontSize: 9, color: '#444', letterSpacing: 1, textTransform: 'uppercase', ...style }}>
    {children}
  </span>
);

const Value = ({ children, accent, style }) => (
  <span style={{ fontSize: 14, fontWeight: 700, color: accent || '#d4d4d8', letterSpacing: -0.3, ...style }}>
    {children}
  </span>
);

const Divider = () => (
  <div style={{ borderTop: '1px solid #111', margin: '8px 0' }} />
);

const Dot = ({ color }) => (
  <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
);

const GhostBtn = ({ onClick, children, accent, style, disabled }) => {
  const base = {
    background: 'transparent',
    border: `1px solid ${disabled ? '#1a1a1a' : (accent ? accent + '44' : '#1a1a1a')}`,
    color: disabled ? '#2a2a2a' : (accent || '#444'),
    padding: '4px 10px',
    fontSize: 9,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex', alignItems: 'center', gap: 5,
    fontFamily: S.fontFamily,
    transition: 'color 0.12s, border-color 0.12s',
    flexShrink: 0,
    ...style,
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={base}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.color = accent || '#aaa'; e.currentTarget.style.borderColor = (accent || '#aaa') + '66'; }}}
      onMouseLeave={e => { if (!disabled) { e.currentTarget.style.color = accent || '#444'; e.currentTarget.style.borderColor = (accent ? accent + '44' : '#1a1a1a'); }}}
    >
      {children}
    </button>
  );
};

const XBtn = ({ onClick }) => (
  <button onClick={onClick} style={{
    background: 'transparent', border: 'none', color: '#2a2a2a',
    cursor: 'pointer', padding: '2px 4px', fontSize: 11, lineHeight: 1,
    fontFamily: S.fontFamily, transition: 'color 0.12s',
  }}
    onMouseEnter={e => e.currentTarget.style.color = '#ef5350'}
    onMouseLeave={e => e.currentTarget.style.color = '#2a2a2a'}
  >×</button>
);

// ── Main Component ────────────────────────────────────────────────────────────

const CaisseRecuCard = React.memo(({
  vendeurActuel,
  sellerDeposits = [],
  totalDeposits = 0,
  totalAjustePourCaisse = 0,
  especesAttendues = 0,
  isPropane = false,
  tauxUSD = 132,
  accent = '#7a7aff',
}) => {
  const dotColor = isPropane ? '#f87171' : accent;
  const usdColor = '#4ade80';
  const htgColor = accent;

  // ── State ──
  const [inputValue, setInputValue]       = useState('');
  const [currencyType, setCurrencyType]   = useState('HTG');
  const [cashSequences, setCashSequences] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('aucune');
  const [showPresets, setShowPresets]     = useState(false);
  const [roundAmount, setRoundAmount]     = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  const inputDebounceRef     = useRef(null);
  const calculationTimeoutRef = useRef(null);

  // ── Presets ──
  const htgPresets = [
    { value: '5',      label: '5' },
    { value: '10',     label: '10' },
    { value: '20',     label: '20' },
    { value: '25',     label: '25' },
    { value: '50',     label: '50' },
    { value: '100',    label: '100' },
    { value: '250',    label: '250' },
    { value: '500',    label: '500' },
    { value: '1000',   label: '1,000' },
    { value: '5000',   label: '5,000' },
    { value: '10000',  label: '10k' },
    { value: '25000',  label: '25k' },
    { value: '50000',  label: '50k' },
    { value: '100000', label: '100k' },
  ];
  const usdPresets = [
    { value: '1',  label: '1' },
    { value: '5',  label: '5' },
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' },
    { value: '100',label: '100' },
  ];

  const htgQuickAdds = [100, 250, 500, 1000];
  const usdQuickAdds = [1, 5, 10, 20];
  const quickAddAmounts  = currencyType === 'HTG' ? htgQuickAdds : usdQuickAdds;
  const currentPresets   = currencyType === 'HTG' ? htgPresets : usdPresets;
  const isDirectAmount   = selectedPreset === 'aucune';
  const commonRoundAmounts = [50, 100, 250, 500, 1000, 2000, 5000, 10000];
  const activeCurrencyColor = currencyType === 'USD' ? usdColor : htgColor;

  // ── Format helpers ──
  const formatDepositDisplay = useCallback((depot) => {
    if (!depot) return '';
    try {
      if (typeof depot === 'object' && depot.devise === 'USD') {
        const montantUSD = parseFloat(depot.montant) || 0;
        return `${montantUSD.toFixed(2)} USD (${formaterArgent(montantUSD * tauxUSD)} HTG)`;
      }
      if (typeof depot === 'object' && depot.value !== undefined) {
        return `${formaterArgent(parseFloat(depot.value) || 0)} HTG`;
      }
      return `${formaterArgent(parseFloat(depot) || 0)} HTG`;
    } catch { return 'Erreur'; }
  }, [tauxUSD]);

  // ── Memos ──
  const depositBreakdown = useMemo(() => {
    if (!Array.isArray(sellerDeposits)) return [];
    return sellerDeposits.filter(Boolean).map((depot, i) => {
      const isUSD = typeof depot === 'object' && depot.devise === 'USD';
      let amountInHTG = 0;
      if (isUSD)                                           amountInHTG = (parseFloat(depot.montant) || 0) * tauxUSD;
      else if (typeof depot === 'object' && depot.value !== undefined) amountInHTG = parseFloat(depot.value) || 0;
      else                                                 amountInHTG = parseFloat(depot) || 0;
      return { id: i + 1, display: formatDepositDisplay(depot), isUSD, amountInHTG };
    });
  }, [sellerDeposits, tauxUSD, formatDepositDisplay]);

  const calculatedTotalDepositsHTG  = useMemo(() => depositBreakdown.reduce((s, d) => s + d.amountInHTG, 0), [depositBreakdown]);
  const calculatedEspecesAttendues  = useMemo(() => totalAjustePourCaisse - calculatedTotalDepositsHTG, [totalAjustePourCaisse, calculatedTotalDepositsHTG]);
  const totalCashRecuHTG = useMemo(() => cashSequences.reduce((s, seq) => s + (seq.currency === 'USD' ? (parseFloat(seq.amount) * tauxUSD || 0) : (parseFloat(seq.amount) || 0)), 0), [cashSequences, tauxUSD]);
  const totalHTG = useMemo(() => cashSequences.filter(s => s.currency === 'HTG').reduce((s, seq) => s + (parseFloat(seq.amount) || 0), 0), [cashSequences]);
  const totalUSD = useMemo(() => cashSequences.filter(s => s.currency === 'USD').reduce((s, seq) => s + (parseFloat(seq.amount) || 0), 0), [cashSequences]);

  const changeNeeded    = totalCashRecuHTG - calculatedEspecesAttendues;
  const shouldGiveChange = changeNeeded > 0;
  const isShort          = changeNeeded < 0;
  const givableAmount    = useMemo(() => getMaximumGivableAmount(changeNeeded), [changeNeeded]);
  const remainder        = changeNeeded - givableAmount;
  const hasRemainder     = remainder > 0;

  const roundAmountDetails = useMemo(() => {
    if (!roundAmount || !shouldGiveChange || changeNeeded <= 0) return null;
    const desiredAmount = parseFloat(roundAmount);
    if (isNaN(desiredAmount) || desiredAmount <= 0) return null;
    const customerAdds = desiredAmount - changeNeeded;
    return {
      desiredAmount, currentChange: changeNeeded, customerAdds,
      isValid: customerAdds >= 0,
      message: customerAdds >= 0
        ? `Le client donne ${formaterArgent(customerAdds)} HTG de plus pour recevoir ${formaterArgent(desiredAmount)} HTG`
        : `Impossible: ${formaterArgent(desiredAmount)} HTG est inférieur à ${formaterArgent(changeNeeded)} HTG dû`,
    };
  }, [roundAmount, changeNeeded, shouldGiveChange]);

  const getSelectedPresetText = () => {
    if (isDirectAmount) return 'Montant libre';
    const p = currentPresets.find(p => p.value === selectedPreset);
    return p ? `× ${p.label} ${currencyType}` : 'Sélectionner';
  };

  // ── Handlers ──
  const handleInputChange   = useCallback((e) => setInputValue(e.target.value), []);
  const handleCurrencyToggle = useCallback(() => { setCurrencyType(p => p === 'HTG' ? 'USD' : 'HTG'); setSelectedPreset('aucune'); setInputValue(''); }, []);
  const handleKeyPress      = useCallback((e) => { if (e.key === 'Enter') handleAddSequence(); }, []);
  const handlePresetSelect  = useCallback((v) => { setSelectedPreset(v); setShowPresets(false); if (v === 'aucune') setInputValue(''); }, []);
  const handleClearAll      = useCallback(() => setCashSequences([]), []);
  const handleRemoveSequence = useCallback((id) => setCashSequences(p => p.filter(s => s.id !== id)), []);
  const handleRoundAmountSelect = useCallback((v) => setRoundAmount(v.toString()), []);
  const handleResetRoundAmount  = useCallback(() => setRoundAmount(''), []);

  const handleAddSequence = useCallback(() => {
    let amount = 0, note = '';
    if (isDirectAmount) {
      amount = parseFloat(inputValue) || 0;
      note   = `${amount} ${currencyType}`;
    } else {
      if (inputValue && !isNaN(parseFloat(inputValue))) {
        const mult = parseFloat(inputValue);
        amount = parseFloat(selectedPreset) * mult;
        note   = `${mult} × ${selectedPreset} ${currencyType}`;
      } else {
        amount = parseFloat(selectedPreset);
        note   = `${selectedPreset} ${currencyType}`;
      }
    }
    if (currencyType === 'USD') amount = parseFloat(amount.toFixed(2));
    if (amount > 0) {
      setCashSequences(p => [...p, {
        id: Date.now(), amount, currency: currencyType,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        convertedToHTG: currencyType === 'USD' ? amount * tauxUSD : amount,
        note,
      }]);
      setInputValue('');
      if (!isDirectAmount && inputValue) setSelectedPreset('aucune');
    }
  }, [inputValue, currencyType, selectedPreset, isDirectAmount, tauxUSD]);

  const handleQuickAdd = useCallback((amount) => {
    setCashSequences(p => [...p, {
      id: Date.now(), amount, currency: currencyType,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      convertedToHTG: currencyType === 'USD' ? amount * tauxUSD : amount,
      note: `${amount} ${currencyType}`,
    }]);
  }, [currencyType, tauxUSD]);

  const handleApplyRoundAmount = useCallback(() => {
    if (!roundAmountDetails?.isValid) return;
    const extraAmount = roundAmountDetails.customerAdds;
    if (extraAmount > 0) {
      setCashSequences(p => [...p, {
        id: Date.now(), amount: extraAmount, currency: 'HTG',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        convertedToHTG: extraAmount,
        note: `Client ajoute pour arrondir à ${formaterArgent(roundAmountDetails.desiredAmount)} HTG`,
      }]);
    }
    setRoundAmount('');
  }, [roundAmountDetails]);

  useEffect(() => {
    if (shouldGiveChange && changeNeeded > 1000) {
      setIsCalculating(true);
      calculationTimeoutRef.current = setTimeout(() => setIsCalculating(false), 100);
    } else { setIsCalculating(false); }
    return () => { clearTimeout(calculationTimeoutRef.current); clearTimeout(inputDebounceRef.current); };
  }, [changeNeeded, shouldGiveChange]);

  useEffect(() => () => { clearTimeout(inputDebounceRef.current); clearTimeout(calculationTimeoutRef.current); }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ ...S, border: '1px solid #1a1a1a', background: '#07090b', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', borderBottom: '1px solid #111' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Dot color={dotColor} />
          <Label>Caisse Reçu · {isPropane ? 'Propane' : 'Essence / Diesel'}</Label>
        </div>
        {vendeurActuel && (
          <span style={{ fontSize: 9, color: '#555', letterSpacing: 0.5 }}>{vendeurActuel}</span>
        )}
      </div>

      {/* ── Deposits ── */}
      {sellerDeposits.length > 0 && (
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #111' }}>
          <Row style={{ marginBottom: 6 }}>
            <Label>Total dépôts</Label>
            <Value accent={dotColor}>{formaterArgent(calculatedTotalDepositsHTG)} HTG</Value>
          </Row>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {depositBreakdown.map(dep => (
              <Row key={dep.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Dot color={dep.isUSD ? usdColor : htgColor} />
                  <Label>Dépôt {dep.id}</Label>
                </div>
                <span style={{ fontSize: 10, color: '#666', letterSpacing: 0.3 }}>{dep.display}</span>
              </Row>
            ))}
          </div>
        </div>
      )}

      {/* ── Espèces attendues ── */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid #111' }}>
        <Row>
          <Label>Espèces attendues</Label>
          <div style={{ textAlign: 'right' }}>
            <Value accent={calculatedEspecesAttendues > 0 ? '#4ade80' : calculatedEspecesAttendues < 0 ? '#f87171' : '#d4d4d8'}>
              {formaterArgent(calculatedEspecesAttendues)} HTG
            </Value>
            <div style={{ fontSize: 9, color: '#2a2a2a', marginTop: 2 }}>
              {formaterArgent(totalAjustePourCaisse)} − {formaterArgent(calculatedTotalDepositsHTG)}
            </div>
          </div>
        </Row>
      </div>

      {/* ── Input section ── */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid #111' }}>

        {/* Currency toggle + rate */}
        <Row style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <GhostBtn onClick={handleCurrencyToggle} accent={activeCurrencyColor}>
              {currencyType}
            </GhostBtn>
            <Label style={{ color: '#333' }}>{currencyType === 'HTG' ? 'Gourdes' : 'Dollars US'}</Label>
          </div>
          <Label style={{ color: '#2a2a2a' }}>1 USD = {tauxUSD} HTG</Label>
        </Row>

        {/* Preset selector */}
        <div style={{ position: 'relative', marginBottom: 8 }}>
          <button
            onClick={() => setShowPresets(p => !p)}
            style={{
              width: '100%', background: 'transparent',
              border: `1px solid ${showPresets ? activeCurrencyColor + '55' : '#1a1a1a'}`,
              color: isDirectAmount ? '#333' : activeCurrencyColor,
              padding: '5px 10px', fontSize: 9, letterSpacing: 0.7, textTransform: 'uppercase',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontFamily: S.fontFamily, transition: 'border-color 0.12s, color 0.12s',
            }}
          >
            <span>{getSelectedPresetText()}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ transform: showPresets ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          {showPresets && (
            <div style={{
              position: 'absolute', zIndex: 30, top: '100%', left: 0, right: 0, marginTop: 2,
              background: '#07090b', border: `1px solid #1e1e1e`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
            }}>
              <button
                onClick={() => handlePresetSelect('aucune')}
                style={{
                  width: '100%', background: isDirectAmount ? activeCurrencyColor + '0d' : 'transparent',
                  border: 'none', borderBottom: '1px solid #111',
                  color: isDirectAmount ? activeCurrencyColor : '#444',
                  padding: '7px 12px', fontSize: 9, letterSpacing: 0.7, textTransform: 'uppercase',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  fontFamily: S.fontFamily,
                }}
              >
                <span>Montant libre</span>
                {isDirectAmount && <span style={{ fontSize: 9, color: activeCurrencyColor }}>✓</span>}
              </button>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, padding: 8 }}>
                {currentPresets.map(p => (
                  <button key={p.value} onClick={() => handlePresetSelect(p.value)} style={{
                    background: selectedPreset === p.value ? activeCurrencyColor + '1a' : 'transparent',
                    border: `1px solid ${selectedPreset === p.value ? activeCurrencyColor + '55' : '#1a1a1a'}`,
                    color: selectedPreset === p.value ? activeCurrencyColor : '#444',
                    padding: '5px 4px', fontSize: 9, letterSpacing: 0.5, cursor: 'pointer',
                    fontFamily: S.fontFamily, transition: 'all 0.1s',
                  }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div style={{ fontSize: 9, color: '#2a2a2a', marginTop: 4, textAlign: 'center', letterSpacing: 0.4 }}>
            {isDirectAmount ? 'Entrez directement le montant' : `Ex: 33 × ${selectedPreset} ${currencyType}`}
          </div>
        </div>

        {/* Input + add */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: 10, fontSize: 9, color: '#333', letterSpacing: 0.5, pointerEvents: 'none' }}>
              {isDirectAmount ? currencyType : '×'}
            </span>
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={isDirectAmount ? `Montant en ${currencyType}…` : 'Multiplicateur…'}
              style={{
                width: '100%', background: 'transparent',
                border: `1px solid ${inputValue ? activeCurrencyColor + '44' : '#1a1a1a'}`,
                color: '#d4d4d8', padding: '6px 10px 6px 34px', fontSize: 12, fontWeight: 700,
                outline: 'none', fontFamily: S.fontFamily,
                transition: 'border-color 0.12s',
              }}
            />
          </div>
          <GhostBtn
            onClick={handleAddSequence}
            accent={activeCurrencyColor}
            disabled={!inputValue || parseFloat(inputValue) <= 0}
          >
            + Ajouter
          </GhostBtn>
        </div>

        {/* Multiplication preview */}
        {!isDirectAmount && inputValue && !isNaN(parseFloat(inputValue)) && selectedPreset !== 'aucune' && (
          <div style={{ padding: '5px 10px', border: '1px solid #1a1a1a', marginBottom: 8, textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: activeCurrencyColor, letterSpacing: 0.4 }}>
              {inputValue} × {selectedPreset} = {formaterArgent(parseFloat(selectedPreset) * parseFloat(inputValue))} {currencyType}
            </span>
            {currencyType === 'USD' && (
              <span style={{ fontSize: 9, color: '#444', marginLeft: 8 }}>
                ({formaterArgent(parseFloat(selectedPreset) * parseFloat(inputValue) * tauxUSD)} HTG)
              </span>
            )}
          </div>
        )}

        {/* Quick add */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${quickAddAmounts.length}, 1fr)`, gap: 4 }}>
          {quickAddAmounts.map(amount => (
            <GhostBtn key={amount} onClick={() => handleQuickAdd(amount)} accent={activeCurrencyColor} style={{ justifyContent: 'center' }}>
              +{currencyType === 'USD' ? '$' : ''}{amount}
            </GhostBtn>
          ))}
        </div>
      </div>

      {/* ── Cash sequences list ── */}
      {cashSequences.length > 0 && (
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #111' }}>

          {/* Totals summary */}
          <Row style={{ marginBottom: 8 }}>
            <Label>Total reçu</Label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Value accent={activeCurrencyColor}>{formaterArgent(totalCashRecuHTG)} HTG</Value>
              <GhostBtn onClick={handleClearAll} accent="#f87171" style={{ padding: '2px 6px' }}>
                Effacer
              </GhostBtn>
            </div>
          </Row>
          <Row style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <Dot color={htgColor} />
              <Label>HTG</Label>
            </div>
            <span style={{ fontSize: 10, color: '#666' }}>{formaterArgent(totalHTG)} HTG</span>
          </Row>
          <Row style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <Dot color={usdColor} />
              <Label>USD</Label>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 10, color: '#666' }}>{totalUSD.toFixed(2)} USD</span>
              <span style={{ fontSize: 9, color: '#2a2a2a', marginLeft: 6 }}>({formaterArgent(totalUSD * tauxUSD)} HTG)</span>
            </div>
          </Row>

          <Divider />

          {/* Sequence rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 140, overflowY: 'auto' }}>
            {cashSequences.map((seq, i) => (
              <Row key={seq.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Dot color={seq.currency === 'USD' ? usdColor : htgColor} />
                  <Label>#{i + 1}</Label>
                  <span style={{ fontSize: 9, color: '#2a2a2a' }}>{seq.timestamp}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 10, color: seq.currency === 'USD' ? usdColor : htgColor, fontWeight: 600 }}>
                      {seq.currency === 'USD' ? '$' : ''}{formaterArgent(seq.amount)} {seq.currency}
                    </span>
                    {seq.currency === 'USD' && (
                      <div style={{ fontSize: 9, color: '#2a2a2a' }}>= {formaterArgent(seq.convertedToHTG)} HTG</div>
                    )}
                    {seq.note && <div style={{ fontSize: 9, color: '#2a2a2a', fontStyle: 'italic' }}>{seq.note}</div>}
                  </div>
                  <XBtn onClick={() => handleRemoveSequence(seq.id)} />
                </div>
              </Row>
            ))}
          </div>
        </div>
      )}

      {/* ── Change calculation ── */}
      {cashSequences.length > 0 && (
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #111' }}>

          {/* Change summary */}
          <Row style={{ marginBottom: 8 }}>
            <Label>{shouldGiveChange ? 'À rendre' : isShort ? 'Manquant' : 'Exact'}</Label>
            <Value accent={shouldGiveChange ? '#4ade80' : isShort ? '#f87171' : '#4ade80'}>
              {formaterArgent(Math.abs(changeNeeded))} HTG
            </Value>
          </Row>

          {/* Remainder warning */}
          {shouldGiveChange && hasRemainder && (
            <div style={{ border: '1px solid #fbbf2433', padding: '8px 10px', marginBottom: 8 }}>
              <div style={{ fontSize: 9, color: '#fbbf24', letterSpacing: 0.5, marginBottom: 3 }}>
                Note — Reste à abandonner
              </div>
              <div style={{ fontSize: 9, color: '#555', lineHeight: 1.6 }}>
                On ne peut rendre que <span style={{ color: '#fbbf24' }}>{formaterArgent(givableAmount)} HTG</span>.{' '}
                Le vendeur abandonne: <span style={{ color: '#fbbf24', fontWeight: 700 }}>{formaterArgent(remainder)} HTG</span>
              </div>
            </div>
          )}

          {/* Change combinations */}
          {shouldGiveChange && (
            isCalculating ? (
              <div style={{ textAlign: 'center', padding: '12px 0', fontSize: 9, color: '#333', letterSpacing: 0.8 }}>
                Calcul en cours…
              </div>
            ) : (
              <ChangeCombinations changeNeeded={changeNeeded} shouldGiveChange={shouldGiveChange} />
            )
          )}

          {/* Round amount tool */}
          {shouldGiveChange && (
            <>
              <Divider />
              <Row style={{ marginBottom: 6 }}>
                <Label style={{ color: accent }}>Arrondir le montant</Label>
                {roundAmount && <GhostBtn onClick={handleResetRoundAmount} accent="#555" style={{ padding: '2px 6px' }}>Réinitialiser</GhostBtn>}
              </Row>
              <div style={{ fontSize: 9, color: '#2a2a2a', textAlign: 'center', marginBottom: 8, letterSpacing: 0.4 }}>
                Le client veut recevoir un montant rond
              </div>

              {/* Round amount input */}
              <div style={{ position: 'relative', display: 'flex', gap: 6, marginBottom: 6 }}>
                <input
                  type="number"
                  value={roundAmount}
                  onChange={e => setRoundAmount(e.target.value)}
                  placeholder="Montant désiré (ex: 50, 100, 500)…"
                  style={{
                    flex: 1, background: 'transparent',
                    border: `1px solid ${roundAmount ? accent + '44' : '#1a1a1a'}`,
                    color: '#d4d4d8', padding: '6px 10px', fontSize: 10,
                    outline: 'none', fontFamily: S.fontFamily,
                  }}
                />
                {roundAmountDetails?.isValid && (
                  <GhostBtn onClick={handleApplyRoundAmount} accent={accent}>
                    + Appliquer
                  </GhostBtn>
                )}
              </div>

              {/* Quick round amounts */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, marginBottom: 8 }}>
                {commonRoundAmounts.map(a => (
                  <GhostBtn key={a} onClick={() => handleRoundAmountSelect(a)} accent={accent} style={{ justifyContent: 'center' }}>
                    {a}
                  </GhostBtn>
                ))}
              </div>

              {/* Round amount result */}
              {roundAmountDetails && (
                <div style={{ border: `1px solid ${roundAmountDetails.isValid ? accent + '33' : '#f8717133'}`, padding: '8px 10px' }}>
                  <div style={{ fontSize: 9, color: roundAmountDetails.isValid ? accent : '#f87171', letterSpacing: 0.5, marginBottom: 6 }}>
                    {roundAmountDetails.isValid ? 'Échange proposé' : 'Impossible'}
                  </div>
                  <Row style={{ marginBottom: 4 }}>
                    <Label>Actuellement dû</Label>
                    <span style={{ fontSize: 10, color: '#666' }}>{formaterArgent(roundAmountDetails.currentChange)} HTG</span>
                  </Row>
                  <Row style={{ marginBottom: 4 }}>
                    <Label>Le client veut</Label>
                    <span style={{ fontSize: 10, color: accent }}>{formaterArgent(roundAmountDetails.desiredAmount)} HTG</span>
                  </Row>
                  <Divider />
                  <Row>
                    <Label>Le client doit donner</Label>
                    <span style={{ fontSize: 11, fontWeight: 700, color: roundAmountDetails.isValid ? '#4ade80' : '#f87171' }}>
                      {roundAmountDetails.isValid ? '+' : ''}{formaterArgent(Math.abs(roundAmountDetails.customerAdds))} HTG
                    </span>
                  </Row>
                </div>
              )}
            </>
          )}

          {/* Exact / short status */}
          {!shouldGiveChange && (
            <div style={{ textAlign: 'center', padding: '6px 0' }}>
              <div style={{ fontSize: 10, color: isShort ? '#f87171' : '#4ade80', letterSpacing: 0.5 }}>
                {isShort ? 'Doit donner plus' : 'Montant exact'}
              </div>
              {isShort && (
                <div style={{ fontSize: 9, color: '#333', marginTop: 3 }}>
                  Manque {formaterArgent(Math.abs(changeNeeded))} HTG
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Empty state instructions ── */}
      {cashSequences.length === 0 && (
        <div style={{ padding: '12px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: '#2a2a2a', letterSpacing: 0.6, lineHeight: 1.8 }}>
            {isDirectAmount
              ? 'Entrez directement le montant ou utilisez les boutons rapides'
              : `Sélectionnez un montant et entrez un multiplicateur — ex: 33 × ${selectedPreset} ${currencyType}`}
          </div>
        </div>
      )}

    </div>
  );
});

CaisseRecuCard.displayName = 'CaisseRecuCard';
export default CaisseRecuCard;
