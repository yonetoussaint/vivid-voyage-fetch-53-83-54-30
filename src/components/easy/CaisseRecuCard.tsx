// components/easy/CaisseRecuCard.jsx
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { formaterArgent } from '@/utils/formatters';
import { getMaximumGivableAmount } from '@/utils/changeCalculator';
import ChangeCombinations from './ChangeCombinations';

const F = "'DM Mono', 'Fira Mono', monospace";

// ── Primitives ────────────────────────────────────────────────────────────────

const Row = ({ children, style }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...style }}>{children}</div>
);

const Label = ({ children, style }) => (
  <span style={{ fontSize: 9, color: '#a0a0a0', letterSpacing: 1, textTransform: 'uppercase', fontFamily: F, ...style }}>{children}</span>
);

const Value = ({ children, accent, style }) => (
  <span style={{ fontSize: 15, fontWeight: 500, color: accent || '#0a0a0a', letterSpacing: -0.3, fontFamily: F, ...style }}>{children}</span>
);

const Divider = () => <div style={{ borderTop: '1px solid #f0f0f0', margin: '8px 0' }} />;

const Dot = ({ color }) => (
  <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
);

const GhostBtn = ({ onClick, children, accent, style, disabled }) => {
  const c = disabled ? '#d0d0d0' : (accent || '#888');
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        background: 'transparent',
        border: `1px solid ${disabled ? '#ebebeb' : (accent ? accent + '55' : '#e2e2e2')}`,
        color: c, padding: '4px 10px', fontSize: 9,
        letterSpacing: 0.7, textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', gap: 5,
        fontFamily: F, transition: 'color 0.12s, border-color 0.12s',
        flexShrink: 0, ...style,
      }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.color = accent || '#333'; e.currentTarget.style.borderColor = (accent || '#333') + '88'; }}}
      onMouseLeave={e => { if (!disabled) { e.currentTarget.style.color = c; e.currentTarget.style.borderColor = disabled ? '#ebebeb' : (accent ? accent + '55' : '#e2e2e2'); }}}
    >
      {children}
    </button>
  );
};

const XBtn = ({ onClick }) => (
  <button onClick={onClick} style={{
    background: 'transparent', border: 'none', color: '#d0d0d0',
    cursor: 'pointer', padding: '2px 4px', fontSize: 13, lineHeight: 1,
    fontFamily: F, transition: 'color 0.12s',
  }}
    onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
    onMouseLeave={e => e.currentTarget.style.color = '#d0d0d0'}
  >×</button>
);

// ── Main ──────────────────────────────────────────────────────────────────────

const CaisseRecuCard = React.memo(({
  vendeurActuel,
  sellerDeposits = [],
  totalDeposits = 0,
  totalAjustePourCaisse = 0,
  especesAttendues = 0,
  isPropane = false,
  tauxUSD = 132,
  accent = '#4f46e5',
}) => {
  const dotColor = isPropane ? '#ef4444' : accent;
  const usdColor = '#059669';
  const htgColor = accent;

  const [inputValue, setInputValue] = useState('');
  const [currencyType, setCurrencyType] = useState('HTG');
  const [cashSequences, setCashSequences] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('aucune');
  const [showPresets, setShowPresets] = useState(false);
  const [roundAmount, setRoundAmount] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  const inputDebounceRef = useRef(null);
  const calculationTimeoutRef = useRef(null);

  const htgPresets = [
    { value: '5', label: '5' }, { value: '10', label: '10' }, { value: '20', label: '20' },
    { value: '25', label: '25' }, { value: '50', label: '50' }, { value: '100', label: '100' },
    { value: '250', label: '250' }, { value: '500', label: '500' }, { value: '1000', label: '1,000' },
    { value: '5000', label: '5k' }, { value: '10000', label: '10k' }, { value: '25000', label: '25k' },
    { value: '50000', label: '50k' }, { value: '100000', label: '100k' },
  ];
  const usdPresets = [
    { value: '1', label: '1' }, { value: '5', label: '5' }, { value: '10', label: '10' },
    { value: '20', label: '20' }, { value: '50', label: '50' }, { value: '100', label: '100' },
  ];

  const htgQuickAdds = [100, 250, 500, 1000];
  const usdQuickAdds = [1, 5, 10, 20];
  const quickAddAmounts = currencyType === 'HTG' ? htgQuickAdds : usdQuickAdds;
  const currentPresets = currencyType === 'HTG' ? htgPresets : usdPresets;
  const isDirectAmount = selectedPreset === 'aucune';
  const commonRoundAmounts = [50, 100, 250, 500, 1000, 2000, 5000, 10000];
  const activeCurrencyColor = currencyType === 'USD' ? usdColor : htgColor;

  // ===== SIMPLE STATE SETTERS (no dependencies) =====
  const handleInputChange = useCallback((e) => setInputValue(e.target.value), []);
  
  const handleCurrencyToggle = useCallback(() => { 
    setCurrencyType(p => p === 'HTG' ? 'USD' : 'HTG'); 
    setSelectedPreset('aucune'); 
    setInputValue(''); 
  }, []);
  
  const handlePresetSelect = useCallback((v) => { 
    setSelectedPreset(v); 
    setShowPresets(false); 
    if (v === 'aucune') setInputValue(''); 
  }, []);
  
  const handleClearAll = useCallback(() => setCashSequences([]), []);
  
  const handleRemoveSequence = useCallback((id) => setCashSequences(p => p.filter(s => s.id !== id)), []);
  
  const handleRoundAmountSelect = useCallback((v) => setRoundAmount(v.toString()), []);
  
  const handleResetRoundAmount = useCallback(() => setRoundAmount(''), []);

  // ===== FUNCTIONS THAT DEPEND ON PROPS =====
  const formatDepositDisplay = useCallback((depot) => {
    if (!depot) return '';
    try {
      if (typeof depot === 'object' && depot.devise === 'USD') {
        const u = parseFloat(depot.montant) || 0;
        return `${u.toFixed(2)} USD (${formaterArgent(u * tauxUSD)} HTG)`;
      }
      if (typeof depot === 'object' && depot.value !== undefined)
        return `${formaterArgent(parseFloat(depot.value) || 0)} HTG`;
      return `${formaterArgent(parseFloat(depot) || 0)} HTG`;
    } catch { 
      return 'Erreur'; 
    }
  }, [tauxUSD]);

  // ===== MAIN ACTION FUNCTIONS (defined in order of dependency) =====
  const handleAddSequence = useCallback(() => {
    let amount = 0, note = '';
    
    if (isDirectAmount) { 
      amount = parseFloat(inputValue) || 0; 
      note = `${amount} ${currencyType}`; 
    } else {
      if (inputValue && !isNaN(parseFloat(inputValue))) {
        const mult = parseFloat(inputValue); 
        amount = parseFloat(selectedPreset) * mult;
        note = `${mult} × ${selectedPreset} ${currencyType}`;
      } else { 
        amount = parseFloat(selectedPreset); 
        note = `${selectedPreset} ${currencyType}`; 
      }
    }
    
    if (currencyType === 'USD') {
      amount = Math.round(amount * 100) / 100;
      if (!isFinite(amount) || isNaN(amount)) amount = 0;
    }
    
    if (amount > 0 && isFinite(amount)) {
      setCashSequences(p => [...p, {
        id: Date.now() + Math.random(),
        amount, 
        currency: currencyType,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        convertedToHTG: currencyType === 'USD' ? amount * tauxUSD : amount, 
        note,
      }]);
      setInputValue('');
      if (!isDirectAmount && inputValue) setSelectedPreset('aucune');
    }
  }, [inputValue, currencyType, selectedPreset, isDirectAmount, tauxUSD]);

  // handleKeyPress depends on handleAddSequence - defined AFTER it
  const handleKeyPress = useCallback((e) => { 
    if (e.key === 'Enter') handleAddSequence(); 
  }, [handleAddSequence]);

  const handleQuickAdd = useCallback((amount) => {
    if (!amount || amount <= 0) return;
    
    setCashSequences(p => [...p, {
      id: Date.now() + Math.random(),
      amount, 
      currency: currencyType,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      convertedToHTG: currencyType === 'USD' ? amount * tauxUSD : amount,
      note: `${amount} ${currencyType}`,
    }]);
  }, [currencyType, tauxUSD]);

  // ===== MEMOIZED VALUES =====
  const depositBreakdown = useMemo(() => {
    if (!Array.isArray(sellerDeposits)) return [];
    return sellerDeposits.filter(Boolean).map((depot, i) => {
      const isUSD = typeof depot === 'object' && depot.devise === 'USD';
      let amountInHTG = 0;
      if (isUSD) amountInHTG = (parseFloat(depot.montant) || 0) * tauxUSD;
      else if (typeof depot === 'object' && depot.value !== undefined) amountInHTG = parseFloat(depot.value) || 0;
      else amountInHTG = parseFloat(depot) || 0;
      return { id: i + 1, display: formatDepositDisplay(depot), isUSD, amountInHTG };
    });
  }, [sellerDeposits, tauxUSD, formatDepositDisplay]);

  const calculatedTotalDepositsHTG = useMemo(() => 
    depositBreakdown.reduce((s, d) => s + d.amountInHTG, 0), 
  [depositBreakdown]);
  
  const calculatedEspecesAttendues = useMemo(() => 
    totalAjustePourCaisse - calculatedTotalDepositsHTG, 
  [totalAjustePourCaisse, calculatedTotalDepositsHTG]);
  
  const totalCashRecuHTG = useMemo(() => 
    cashSequences.reduce((s, seq) => {
      if (seq.currency === 'USD') {
        return s + ((parseFloat(seq.amount) || 0) * tauxUSD);
      }
      return s + (parseFloat(seq.amount) || 0);
    }, 0), 
  [cashSequences, tauxUSD]);
  
  const totalHTG = useMemo(() => 
    cashSequences.filter(s => s.currency === 'HTG')
      .reduce((s, seq) => s + (parseFloat(seq.amount) || 0), 0), 
  [cashSequences]);
  
  const totalUSD = useMemo(() => 
    cashSequences.filter(s => s.currency === 'USD')
      .reduce((s, seq) => s + (parseFloat(seq.amount) || 0), 0), 
  [cashSequences]);

  const changeNeeded = totalCashRecuHTG - calculatedEspecesAttendues;
  const shouldGiveChange = changeNeeded > 0;
  const isShort = changeNeeded < 0;
  const givableAmount = useMemo(() => getMaximumGivableAmount(changeNeeded), [changeNeeded]);
  const remainder = changeNeeded - givableAmount;
  const hasRemainder = remainder > 0;

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

  // handleApplyRoundAmount depends on roundAmountDetails
  const handleApplyRoundAmount = useCallback(() => {
    if (!roundAmountDetails?.isValid) return;
    const extra = roundAmountDetails.customerAdds;
    if (extra > 0 && isFinite(extra)) {
      setCashSequences(p => [...p, {
        id: Date.now() + Math.random(),
        amount: extra, 
        currency: 'HTG',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        convertedToHTG: extra,
        note: `Client ajoute pour arrondir à ${formaterArgent(roundAmountDetails.desiredAmount)} HTG`,
      }]);
    }
    setRoundAmount('');
  }, [roundAmountDetails]);

  const getSelectedPresetText = useCallback(() => {
    if (isDirectAmount) return 'Montant libre';
    const p = currentPresets.find(p => p.value === selectedPreset);
    return p ? `× ${p.label} ${currencyType}` : 'Sélectionner';
  }, [isDirectAmount, currentPresets, selectedPreset, currencyType]);

  // ===== EFFECTS =====
  useEffect(() => {
    if (shouldGiveChange && changeNeeded > 1000) {
      setIsCalculating(true);
      
      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current);
      }
      
      calculationTimeoutRef.current = setTimeout(() => {
        setIsCalculating(false);
        calculationTimeoutRef.current = null;
      }, 100);
    } else { 
      setIsCalculating(false); 
    }
    
    return () => {
      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current);
        calculationTimeoutRef.current = null;
      }
    };
  }, [changeNeeded, shouldGiveChange]);

  useEffect(() => {
    return () => {
      if (inputDebounceRef.current) {
        clearTimeout(inputDebounceRef.current);
      }
      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current);
      }
    };
  }, []);

  const inputStyle = (hasValue) => ({
    width: '100%', background: '#ffffff',
    border: `1px solid ${hasValue ? activeCurrencyColor + '55' : '#e2e2e2'}`,
    color: '#0a0a0a', padding: '7px 10px', fontSize: 11, fontWeight: 500,
    outline: 'none', fontFamily: F, transition: 'border-color 0.12s', boxSizing: 'border-box',
  });

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');`}</style>
      <div style={{ fontFamily: F, border: '1px solid #e8e8e8', background: '#fafafa', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', borderBottom: '1px solid #f0f0f0', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Dot color={dotColor} />
            <Label>Caisse Reçu · {isPropane ? 'Propane' : 'Essence / Diesel'}</Label>
          </div>
          {vendeurActuel && <span style={{ fontSize: 9, color: '#b0b0b0', letterSpacing: 0.5 }}>{vendeurActuel}</span>}
        </div>

        {/* Deposits */}
        {sellerDeposits.length > 0 && (
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #f0f0f0', background: '#ffffff' }}>
            <Row style={{ marginBottom: 6 }}>
              <Label>Total dépôts</Label>
              <Value accent={dotColor}>{formaterArgent(calculatedTotalDepositsHTG)} HTG</Value>
            </Row>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {depositBreakdown.map(dep => (
                <Row key={dep.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Dot color={dep.isUSD ? usdColor : htgColor} />
                    <Label>Dépôt {dep.id}</Label>
                  </div>
                  <span style={{ fontSize: 10, color: '#555', letterSpacing: 0.3 }}>{dep.display}</span>
                </Row>
              ))}
            </div>
          </div>
        )}

        {/* Espèces attendues */}
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #f0f0f0', background: '#ffffff' }}>
          <Row>
            <Label>Espèces attendues</Label>
            <div style={{ textAlign: 'right' }}>
              <Value accent={calculatedEspecesAttendues > 0 ? '#059669' : calculatedEspecesAttendues < 0 ? '#dc2626' : '#0a0a0a'}>
                {formaterArgent(calculatedEspecesAttendues)} HTG
              </Value>
              <div style={{ fontSize: 9, color: '#c8c8c8', marginTop: 2 }}>
                {formaterArgent(totalAjustePourCaisse)} − {formaterArgent(calculatedTotalDepositsHTG)}
              </div>
            </div>
          </Row>
        </div>

        {/* Input section */}
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #f0f0f0' }}>

          {/* Currency toggle + rate */}
          <Row style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <GhostBtn onClick={handleCurrencyToggle} accent={activeCurrencyColor}>{currencyType}</GhostBtn>
              <Label style={{ color: '#c0c0c0' }}>{currencyType === 'HTG' ? 'Gourdes' : 'Dollars US'}</Label>
            </div>
            <Label style={{ color: '#d0d0d0' }}>1 USD = {tauxUSD} HTG</Label>
          </Row>

          {/* Preset selector */}
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <button
              onClick={() => setShowPresets(p => !p)}
              style={{
                width: '100%', background: '#ffffff',
                border: `1px solid ${showPresets ? activeCurrencyColor + '66' : '#e2e2e2'}`,
                color: isDirectAmount ? '#b0b0b0' : activeCurrencyColor,
                padding: '6px 10px', fontSize: 9, letterSpacing: 0.7, textTransform: 'uppercase',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                fontFamily: F, transition: 'border-color 0.12s, color 0.12s',
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
                background: '#ffffff', border: '1px solid #e8e8e8',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              }}>
                <button
                  onClick={() => handlePresetSelect('aucune')}
                  style={{
                    width: '100%', background: isDirectAmount ? activeCurrencyColor + '0a' : 'transparent',
                    border: 'none', borderBottom: '1px solid #f0f0f0',
                    color: isDirectAmount ? activeCurrencyColor : '#888',
                    padding: '7px 12px', fontSize: 9, letterSpacing: 0.7, textTransform: 'uppercase',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontFamily: F,
                  }}
                >
                  <span>Montant libre</span>
                  {isDirectAmount && <span style={{ color: activeCurrencyColor }}>✓</span>}
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, padding: 8 }}>
                  {currentPresets.map(p => (
                    <button key={p.value} onClick={() => handlePresetSelect(p.value)} style={{
                      background: selectedPreset === p.value ? activeCurrencyColor + '0f' : 'transparent',
                      border: `1px solid ${selectedPreset === p.value ? activeCurrencyColor + '55' : '#e8e8e8'}`,
                      color: selectedPreset === p.value ? activeCurrencyColor : '#888',
                      padding: '5px 4px', fontSize: 9, letterSpacing: 0.5, cursor: 'pointer',
                      fontFamily: F, transition: 'all 0.1s',
                    }}>{p.label}</button>
                  ))}
                </div>
              </div>
            )}
            <div style={{ fontSize: 9, color: '#c8c8c8', marginTop: 4, textAlign: 'center', letterSpacing: 0.4 }}>
              {isDirectAmount ? 'Entrez directement le montant' : `Ex: 33 × ${selectedPreset} ${currencyType}`}
            </div>
          </div>

          {/* Input + add */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 9, color: '#c0c0c0', letterSpacing: 0.5, pointerEvents: 'none' }}>
                {isDirectAmount ? currencyType : '×'}
              </span>
              <input
                type="number" value={inputValue}
                onChange={handleInputChange} onKeyPress={handleKeyPress}
                placeholder={isDirectAmount ? `Montant en ${currencyType}…` : 'Multiplicateur…'}
                style={{ ...inputStyle(!!inputValue), paddingLeft: 36 }}
              />
            </div>
            <GhostBtn onClick={handleAddSequence} accent={activeCurrencyColor} disabled={!inputValue || parseFloat(inputValue) <= 0}>
              + Ajouter
            </GhostBtn>
          </div>

          {/* Preview */}
          {!isDirectAmount && inputValue && !isNaN(parseFloat(inputValue)) && selectedPreset !== 'aucune' && (
            <div style={{ padding: '5px 10px', border: '1px solid #f0f0f0', marginBottom: 8, textAlign: 'center', background: '#ffffff' }}>
              <span style={{ fontSize: 10, color: activeCurrencyColor }}>
                {inputValue} × {selectedPreset} = {formaterArgent(parseFloat(selectedPreset) * parseFloat(inputValue))} {currencyType}
              </span>
              {currencyType === 'USD' && (
                <span style={{ fontSize: 9, color: '#b0b0b0', marginLeft: 8 }}>
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

        {/* Sequences list */}
        {cashSequences.length > 0 && (
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #f0f0f0', background: '#ffffff' }}>
            <Row style={{ marginBottom: 8 }}>
              <Label>Total reçu</Label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Value accent={activeCurrencyColor}>{formaterArgent(totalCashRecuHTG)} HTG</Value>
                <GhostBtn onClick={handleClearAll} accent="#ef4444" style={{ padding: '2px 7px' }}>Effacer</GhostBtn>
              </div>
            </Row>
            {[{ label: 'HTG', value: `${formaterArgent(totalHTG)} HTG`, color: htgColor },
              { label: 'USD', value: `${totalUSD.toFixed(2)} USD`, sub: `${formaterArgent(totalUSD * tauxUSD)} HTG`, color: usdColor }
            ].map(({ label, value, sub, color }) => (
              <Row key={label} style={{ marginBottom: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Dot color={color} /><Label>{label}</Label></div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 10, color: '#555' }}>{value}</span>
                  {sub && <span style={{ fontSize: 9, color: '#c0c0c0', marginLeft: 6 }}>({sub})</span>}
                </div>
              </Row>
            ))}

            <Divider />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 140, overflowY: 'auto' }}>
              {cashSequences.map((seq, i) => (
                <Row key={seq.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Dot color={seq.currency === 'USD' ? usdColor : htgColor} />
                    <Label>#{i + 1}</Label>
                    <span style={{ fontSize: 9, color: '#c8c8c8' }}>{seq.timestamp}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 10, color: seq.currency === 'USD' ? usdColor : htgColor, fontWeight: 500 }}>
                        {seq.currency === 'USD' ? '$' : ''}{formaterArgent(seq.amount)} {seq.currency}
                      </span>
                      {seq.currency === 'USD' && <div style={{ fontSize: 9, color: '#c0c0c0' }}>= {formaterArgent(seq.convertedToHTG)} HTG</div>}
                      {seq.note && <div style={{ fontSize: 9, color: '#c8c8c8', fontStyle: 'italic' }}>{seq.note}</div>}
                    </div>
                    <XBtn onClick={() => handleRemoveSequence(seq.id)} />
                  </div>
                </Row>
              ))}
            </div>
          </div>
        )}

        {/* Change calculation */}
        {cashSequences.length > 0 && (
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #f0f0f0' }}>
            <Row style={{ marginBottom: 8 }}>
              <Label>{shouldGiveChange ? 'À rendre' : isShort ? 'Manquant' : 'Exact'}</Label>
              <Value accent={shouldGiveChange ? '#059669' : isShort ? '#dc2626' : '#059669'}>
                {formaterArgent(Math.abs(changeNeeded))} HTG
              </Value>
            </Row>

            {shouldGiveChange && hasRemainder && (
              <div style={{ border: '1px solid #fde68a', background: '#fffbeb', padding: '8px 10px', marginBottom: 8 }}>
                <div style={{ fontSize: 9, color: '#d97706', letterSpacing: 0.5, marginBottom: 3 }}>Note — Reste à abandonner</div>
                <div style={{ fontSize: 9, color: '#92400e', lineHeight: 1.6 }}>
                  On ne peut rendre que <span style={{ fontWeight: 500 }}>{formaterArgent(givableAmount)} HTG</span>.{' '}
                  Le vendeur abandonne: <span style={{ fontWeight: 500 }}>{formaterArgent(remainder)} HTG</span>
                </div>
              </div>
            )}

            {shouldGiveChange && (
              isCalculating ? (
                <div style={{ textAlign: 'center', padding: '12px 0', fontSize: 9, color: '#b0b0b0', letterSpacing: 0.8 }}>
                  Calcul en cours…
                </div>
              ) : (
                <ChangeCombinations changeNeeded={changeNeeded} shouldGiveChange={shouldGiveChange} />
              )
            )}

            {shouldGiveChange && (
              <>
                <Divider />
                <Row style={{ marginBottom: 6 }}>
                  <Label style={{ color: accent }}>Arrondir le montant</Label>
                  {roundAmount && <GhostBtn onClick={handleResetRoundAmount} accent="#b0b0b0" style={{ padding: '2px 7px' }}>Réinitialiser</GhostBtn>}
                </Row>
                <div style={{ fontSize: 9, color: '#c0c0c0', textAlign: 'center', marginBottom: 8, letterSpacing: 0.4 }}>
                  Le client veut recevoir un montant rond
                </div>

                <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                  <input
                    type="number" value={roundAmount}
                    onChange={e => setRoundAmount(e.target.value)}
                    placeholder="Montant désiré (ex: 50, 100)…"
                    style={{ ...inputStyle(!!roundAmount), flex: 1 }}
                  />
                  {roundAmountDetails?.isValid && (
                    <GhostBtn onClick={handleApplyRoundAmount} accent={accent}>+ Appliquer</GhostBtn>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, marginBottom: 8 }}>
                  {commonRoundAmounts.map(a => (
                    <GhostBtn key={a} onClick={() => handleRoundAmountSelect(a)} accent={accent} style={{ justifyContent: 'center' }}>{a}</GhostBtn>
                  ))}
                </div>

                {roundAmountDetails && (
                  <div style={{ border: `1px solid ${roundAmountDetails.isValid ? accent + '44' : '#fecaca'}`, background: roundAmountDetails.isValid ? accent + '06' : '#fef2f2', padding: '8px 10px' }}>
                    <div style={{ fontSize: 9, color: roundAmountDetails.isValid ? accent : '#dc2626', letterSpacing: 0.5, marginBottom: 6 }}>
                      {roundAmountDetails.isValid ? 'Échange proposé' : 'Impossible'}
                    </div>
                    <Row style={{ marginBottom: 4 }}>
                      <Label>Actuellement dû</Label>
                      <span style={{ fontSize: 10, color: '#555' }}>{formaterArgent(roundAmountDetails.currentChange)} HTG</span>
                    </Row>
                    <Row style={{ marginBottom: 4 }}>
                      <Label>Le client veut</Label>
                      <span style={{ fontSize: 10, color: accent }}>{formaterArgent(roundAmountDetails.desiredAmount)} HTG</span>
                    </Row>
                    <Divider />
                    <Row>
                      <Label>Le client doit donner</Label>
                      <span style={{ fontSize: 11, fontWeight: 500, color: roundAmountDetails.isValid ? '#059669' : '#dc2626' }}>
                        {roundAmountDetails.isValid ? '+' : ''}{formaterArgent(Math.abs(roundAmountDetails.customerAdds))} HTG
                      </span>
                    </Row>
                  </div>
                )}
              </>
            )}

            {!shouldGiveChange && (
              <div style={{ textAlign: 'center', padding: '6px 0' }}>
                <div style={{ fontSize: 10, color: isShort ? '#dc2626' : '#059669', letterSpacing: 0.5 }}>
                  {isShort ? 'Doit donner plus' : 'Montant exact'}
                </div>
                {isShort && <div style={{ fontSize: 9, color: '#b0b0b0', marginTop: 3 }}>Manque {formaterArgent(Math.abs(changeNeeded))} HTG</div>}
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {cashSequences.length === 0 && (
          <div style={{ padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#c8c8c8', letterSpacing: 0.6, lineHeight: 1.9 }}>
              {isDirectAmount
                ? 'Entrez directement le montant ou utilisez les boutons rapides'
                : `Sélectionnez un montant et entrez un multiplicateur — ex: 33 × ${selectedPreset} ${currencyType}`}
            </div>
          </div>
        )}
      </div>
    </>
  );
});

CaisseRecuCard.displayName = 'CaisseRecuCard';
export default CaisseRecuCard;