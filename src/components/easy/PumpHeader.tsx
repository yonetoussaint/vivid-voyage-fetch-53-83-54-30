// PumpHeader.jsx (updated version)
import React from 'react';
import { calculerTotalPompe } from '@/utils/helpers';
import CaisseRecuCard from './CaisseRecuCard';

// Import new components from easy folder
import VendorAssignment from './VendorAssignment';
import StatisticCard from './StatisticCard';
import TotalGallonsCard from './TotalGallonsCard';
import PropaneSalesCard from './PropaneSalesCard';
import TotalSalesCard from './TotalSalesCard';
import QuickSummaryRow from './QuickSummaryRow';

// Enhanced separator with more control
const Separator = ({ className = "", topMargin = "my-8", bottomMargin = "" }) => (
  <div className={`${topMargin} ${bottomMargin}`}>
    <div className={`-mx-3 border-t-4 border-gray-100 ${className}`}></div>
  </div>
);

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
  let totalPompe, gallonsGasoline, gallonsDiesel, ventesGasoline, ventesDiesel, ventesTotales;

  if (isPropane) {
    const gallonsPropane = (parseFloat(propaneData?.fin) || 0) - (parseFloat(propaneData?.debut) || 0);
    ventesTotales = gallonsPropane * prixPropane;

    totalPompe = {
      gallonsGasoline: 0,
      gallonsDiesel: 0,
      ventesGasoline: 0,
      ventesDiesel: 0,
      ventesTotales: ventesTotales
    };

    gallonsGasoline = 0;
    gallonsDiesel = gallonsPropane;
    ventesGasoline = 0;
    ventesDiesel = ventesTotales;
  } else {
    totalPompe = calculerTotalPompe(donneesPompe, prix);
    gallonsGasoline = totalPompe?.gallonsGasoline || 0;
    gallonsDiesel = totalPompe?.gallonsDiesel || 0;
    ventesGasoline = totalPompe?.ventesGasoline || 0;
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

 <Separator topMargin="mt-2 mb-2" />

      <VendorAssignment
        pompe={pompe}
        isPropane={isPropane}
        vendeurActuel={vendeurActuel}
        vendeurs={vendeurs}
        handleVendeurChange={handleVendeurChange}
      />

 <Separator topMargin="mt-2 mb-2" />

      {/* Quick Statistics */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <StatisticCard
          title={isPropane ? 'Prix Propane' : `Gasoline (${pompe})`}
          value={isPropane ? `${prixPropane}` : gallonsGasoline}
          color={isPropane ? 'red' : 'emerald'}
          unit={isPropane ? 'HTG' : 'gallons'}
        />
        <StatisticCard
          title={isPropane ? 'Gallons Propane' : `Diesel (${pompe})`}
          value={isPropane ? gallonsDiesel.toFixed(3) : gallonsDiesel}
          color={isPropane ? 'orange' : 'amber'}
          unit={isPropane ? 'gallons' : 'gallons'}
        />
      </div>

      {/* Total Gallons Card */}
      <TotalGallonsCard
        gallonsGasoline={gallonsGasoline}
        gallonsDiesel={gallonsDiesel}
        isPropane={isPropane}
        pompe={pompe}
      />

      {/* Gas/Diesel Sales Cards or Propane Sales Card */}
      {!isPropane ? (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <StatisticCard
            title="Gasoline Sales"
            value={ventesGasoline}
            color="emerald"
            unit="HTG"
          />
          <StatisticCard
            title="Diesel Sales"
            value={ventesDiesel}
            color="amber"
            unit="HTG"
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
        gallonsGasoline={gallonsGasoline}
        gallonsDiesel={gallonsDiesel}
        isPropane={isPropane}
        prixPropane={prixPropane}
      />
    </div>
  );
};

export default PumpHeader;