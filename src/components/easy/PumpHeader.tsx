// PumpHeader.jsx (refactored version)
import React from 'react';
import { calculerTotalPompe } from '@/utils/helpers';
import CaisseRecuCard from './CaisseRecuCard';

// Import new components from easy folder
import VendorAssignment from './easy/VendorAssignment';
import StatisticCard from './easy/StatisticCard';
import TotalGallonsCard from './easy/TotalGallonsCard';
import PropaneSalesCard from './easy/PropaneSalesCard';
import TotalSalesCard from './easy/TotalSalesCard';
import QuickSummaryRow from './easy/QuickSummaryRow';

const PumpHeader = ({ 
  pompe, 
  shift, 
  donneesPompe, 
  vendeurs, 
  mettreAJourAffectationVendeur, 
  prix,
  vendeurDepots = {},
  tauxUSD = 132,
  isPropane = false,
  propaneData = null,
  prixPropane = null
}) => {
  // Calculate totals based on mode
  let totalPompe, gallonsEssence, gallonsDiesel, ventesEssence, ventesDiesel, ventesTotales;

  if (isPropane) {
    const gallonsPropane = (parseFloat(propaneData?.fin) || 0) - (parseFloat(propaneData?.debut) || 0);
    ventesTotales = gallonsPropane * prixPropane;

    totalPompe = {
      gallonsEssence: 0,
      gallonsDiesel: 0,
      ventesEssence: 0,
      ventesDiesel: 0,
      ventesTotales: ventesTotales
    };

    gallonsEssence = 0;
    gallonsDiesel = gallonsPropane;
    ventesEssence = 0;
    ventesDiesel = ventesTotales;
  } else {
    totalPompe = calculerTotalPompe(donneesPompe, prix);
    gallonsEssence = totalPompe?.gallonsEssence || 0;
    gallonsDiesel = totalPompe?.gallonsDiesel || 0;
    ventesEssence = totalPompe?.ventesEssence || 0;
    ventesDiesel = totalPompe?.ventesDiesel || 0;
    ventesTotales = totalPompe?.ventesTotales || 0;
  }

  // Calculate rounded adjusted total
  const exactValue = parseFloat(ventesTotales || 0);
  const totalAjustePourCaisse = Math.round(exactValue / 5) * 5;

  // Get current vendeur
  const vendeurActuel = isPropane 
    ? (propaneData?._vendeur || donneesPompe?._vendeur || '') 
    : (donneesPompe?._vendeur || '');

  // Calculate deposits
  const sellerDeposits = vendeurActuel ? vendeurDepots[vendeurActuel] || [] : [];
  const totalDeposits = sellerDeposits.reduce((sum, depot) => {
    if (!depot) return sum;

    if (typeof depot === 'object' && depot.devise === 'USD') {
      const montantUSD = parseFloat(depot.montant) || 0;
      return sum + (montantUSD * tauxUSD);
    } else {
      return sum + (parseFloat(depot) || 0);
    }
  }, 0);

  // Calculate expected cash
  const especesAttendues = totalAjustePourCaisse - totalDeposits;

  // Handle vendeur change
  const handleVendeurChange = (newVendeurId) => {
    if (isPropane) {
      mettreAJourAffectationVendeur('propane', newVendeurId);
    } else {
      mettreAJourAffectationVendeur(pompe, newVendeurId);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Vendor Assignment */}
      <VendorAssignment
        pompe={pompe}
        isPropane={isPropane}
        vendeurActuel={vendeurActuel}
        vendeurs={vendeurs}
        handleVendeurChange={handleVendeurChange}
      />

      {/* Quick Statistics */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <StatisticCard
          title={isPropane ? 'Prix Propane' : `Essence (${pompe})`}
          value={isPropane ? `${prixPropane} HTG` : gallonsEssence}
          subtitle={isPropane ? 'par gallon' : 'gallons'}
          color={isPropane ? 'red' : 'emerald'}
          isPropane={isPropane}
        />
        <StatisticCard
          title={isPropane ? 'Gallons Propane' : `Diesel (${pompe})`}
          value={isPropane ? gallonsDiesel.toFixed(3) : gallonsDiesel}
          subtitle={isPropane ? 'gallons vendus' : 'gallons'}
          color={isPropane ? 'orange' : 'amber'}
          isPropane={isPropane}
        />
      </div>

      {/* Total Gallons Card */}
      <TotalGallonsCard
        gallonsEssence={gallonsEssence}
        gallonsDiesel={gallonsDiesel}
        isPropane={isPropane}
        pompe={pompe}
      />

      {/* Gas/Diesel Sales Cards or Propane Sales Card */}
      {!isPropane ? (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <StatisticCard
            title="Ventes Essence"
            value={ventesEssence}
            subtitle="HTG"
            color="emerald"
          />
          <StatisticCard
            title="Ventes Diesel"
            value={ventesDiesel}
            subtitle="HTG"
            color="amber"
          />
        </div>
      ) : (
        <PropaneSalesCard
          gallonsPropane={gallonsDiesel}
          ventesTotales={ventesTotales}
          prixPropane={prixPropane}
        />
      )}

      {/* Total Sales Card */}
      <TotalSalesCard
        ventesTotales={ventesTotales}
        isPropane={isPropane}
        pompe={pompe}
      />

      {/* Cash Received Card */}
      <CaisseRecuCard
        vendeurActuel={vendeurActuel}
        sellerDeposits={sellerDeposits}
        totalDeposits={totalDeposits}
        totalAjustePourCaisse={totalAjustePourCaisse}
        especesAttendues={especesAttendues}
        isPropane={isPropane}
        tauxUSD={tauxUSD}
      />

      {/* Quick Summary Row */}
      <QuickSummaryRow
        gallonsEssence={gallonsEssence}
        gallonsDiesel={gallonsDiesel}
        isPropane={isPropane}
        prixPropane={prixPropane}
      />
    </div>
  );
};

export default PumpHeader;