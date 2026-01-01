import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { formaterArgent } from '@/utils/formatters';

const PropaneManager = ({ shift, propaneDonnees, mettreAJourPropane, prixPropane }) => {
  // Local state for immediate feedback
  const [localDebut, setLocalDebut] = useState(propaneDonnees?.debut || '');
  const [localFin, setLocalFin] = useState(propaneDonnees?.fin || '');

  // Sync with parent state when it changes
  useEffect(() => {
    setLocalDebut(propaneDonnees?.debut || '');
    setLocalFin(propaneDonnees?.fin || '');
  }, [propaneDonnees]);

  // Handle input changes with immediate feedback
  const handleDebutChange = (e) => {
    const value = e.target.value;
    setLocalDebut(value);
    // Update parent state after a short delay
    setTimeout(() => mettreAJourPropane('debut', value), 0);
  };

  const handleFinChange = (e) => {
    const value = e.target.value;
    setLocalFin(value);
    // Update parent state after a short delay
    setTimeout(() => mettreAJourPropane('fin', value), 0);
  };

  // Calculate propane sales
  const gallons = (parseFloat(localFin) || 0) - (parseFloat(localDebut) || 0);
  const ventes = gallons * prixPropane;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white rounded-xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Flame size={22} />
          <h3 className="text-lg font-bold">Propane - Shift {shift}</h3>
        </div>

        {/* Résumé Propane */}
        <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs opacity-90">Prix/Gallon</p>
              <p className="text-xl font-bold">{prixPropane} HTG</p>
            </div>
            <div>
              <p className="text-xs opacity-90">Total Ventes</p>
              <p className="text-xl font-bold">{formaterArgent(ventes)} HTG</p>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-white border-opacity-30">
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-90">Gallons Vendus</span>
              <span className="text-lg font-bold">{gallons.toFixed(3)}</span>
            </div>
          </div>
        </div>

        {/* Entrées Propane */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-white block mb-1">
              INDEX DÉBUT PROPANE
            </label>
            <input
              type="text"
              value={localDebut}
              onChange={handleDebutChange}
              className="w-full px-4 py-3 text-lg font-semibold border-2 border-white border-opacity-30 bg-white bg-opacity-10 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder-white placeholder-opacity-50"
              placeholder="0.000"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-white block mb-1">
              INDEX FIN PROPANE
            </label>
            <input
              type="text"
              value={localFin}
              onChange={handleFinChange}
              className="w-full px-4 py-3 text-lg font-semibold border-2 border-white border-opacity-30 bg-white bg-opacity-10 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder-white placeholder-opacity-50"
              placeholder="0.000"
            />
          </div>

          {(localDebut || localFin) && (
            <div className="bg-white bg-opacity-20 rounded-lg p-3 border-2 border-white border-opacity-30">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">Gallons Propane</span>
                  <span className="text-xl font-bold">{gallons.toFixed(3)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white border-opacity-30">
                  <span className="text-sm font-semibold">Ventes Total Propane</span>
                  <span className="text-xl font-bold">{formaterArgent(ventes)} HTG</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Note d'information */}
        <div className="mt-4 p-2 bg-white bg-opacity-10 rounded-lg text-xs">
          <p className="font-bold mb-1">Note:</p>
          <p>Les ventes de propane sont additionnées aux totaux finaux.</p>
        </div>
      </div>
    </div>
  );
};

export default PropaneManager;