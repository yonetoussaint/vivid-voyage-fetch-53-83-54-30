import React, { useState, useEffect } from 'react';
import { Calculator, FileText, Trash2, Fuel, User, DollarSign, Users, Plus, Minus, Globe, Flame } from 'lucide-react';

// Composant de Gestion des Vendeurs (réutilisable)
const GestionVendeurs = ({ vendeurs, nouveauVendeur, setNouveauVendeur, ajouterVendeur, supprimerVendeur, getNombreAffectations }) => {
  return (
    <div className="space-y-4">
      {/* Gérer les Vendeurs */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Users size={22} />
          <h2 className="text-lg font-bold">Gérer les Vendeurs</h2>
        </div>

        {/* Ajouter Vendeur */}
        <div className="mb-6">
          <h3 className="text-md font-bold mb-3">Ajouter un Vendeur</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={nouveauVendeur}
              onChange={(e) => setNouveauVendeur(e.target.value)}
              placeholder="Nom du vendeur"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 font-semibold text-base"
              onKeyPress={(e) => e.key === 'Enter' && ajouterVendeur()}
            />
            <button
              onClick={ajouterVendeur}
              className="bg-white text-purple-600 px-4 py-3 rounded-lg font-bold text-base sm:w-auto w-full active:scale-95 transition"
            >
              Ajouter
            </button>
          </div>
        </div>

        {/* Liste des Vendeurs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-bold">Vendeurs Actuels</h3>
            <div className="text-sm opacity-90">
              Total: {vendeurs.length}
            </div>
          </div>

          {vendeurs.length > 0 ? (
            <div className="space-y-3">
              {vendeurs.map((vendeur, index) => (
                <div key={vendeur} className="bg-white bg-opacity-15 rounded-lg p-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0">
                        <User size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-base truncate">{vendeur}</p>
                        <p className="text-sm opacity-90">ID: {index + 1}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 self-end sm:self-center">
                      <div className="bg-white bg-opacity-20 px-3 py-1.5 rounded-lg text-sm">
                        Affecté à: {getNombreAffectations ? getNombreAffectations(vendeur) : 0} pompe(s)
                      </div>
                      <button
                        onClick={() => supprimerVendeur(vendeur)}
                        className="bg-red-500 text-white px-4 py-1.5 rounded-lg font-bold text-sm active:scale-95 transition"
                        aria-label={`Supprimer ${vendeur}`}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white bg-opacity-10 rounded-lg p-6 text-center">
              <Users size={32} className="mx-auto mb-3 opacity-70" />
              <p className="text-white text-opacity-80 mb-2">Aucun vendeur</p>
              <p className="text-sm text-white text-opacity-60">
                Ajoutez des vendeurs pour les affecter aux pompes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Composant En-tête Pompe (réutilisable)
const EnTetePompe = ({ pompe, shift, totalPompe, numeroPompe, getCouleurPompe, formaterArgent, formaterGallons, prix, enfants }) => {
  return (
    <div className={`${getCouleurPompe(numeroPompe)} text-white rounded-xl p-5 shadow-lg`}>
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-xl font-bold">{pompe}</h3>
          <p className="text-sm opacity-90">
            {pompe === 'P5' ? '1 Pistolet Essence' : 'Phase 1: P1-P3 | Phase 2: P4-P6'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-90">Total {shift}</p>
          <p className="text-2xl font-bold">{formaterArgent(totalPompe?.ventesTotales || 0)} HTG</p>
        </div>
      </div>

      {/* Résumé Pompe */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="bg-white bg-opacity-20 rounded-lg p-3">
          <p className="text-xs opacity-90">Essence</p>
          <p className="text-lg font-bold">{formaterGallons(totalPompe?.gallonsEssence || 0)} gal</p>
          <p className="text-sm opacity-90">{formaterArgent(totalPompe?.ventesEssence || 0)} HTG</p>
        </div>
        {pompe !== 'P5' && (
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-xs opacity-90">Diesel</p>
            <p className="text-lg font-bold">{formaterGallons(totalPompe?.gallonsDiesel || 0)} gal</p>
            <p className="text-sm opacity-90">{formaterArgent(totalPompe?.ventesDiesel || 0)} HTG</p>
          </div>
        )}
      </div>

      {enfants}
    </div>
  );
};

// Composant Saisie Pistolet (réutilisable)
const SaisiePistolet = ({ pistolet, donnees, pompe, mettreAJourLecture, getCouleurCarburant, getCouleurBadge, prix, calculerGallons, formaterGallons, formaterArgent }) => {
  const gallons = calculerGallons(donnees.debut, donnees.fin);
  const prixUnitaire = donnees.typeCarburant === 'Diesel' ? prix.diesel : prix.essence;
  const ventes = gallons * prixUnitaire;

  return (
    <div key={pistolet} className={`rounded-xl shadow-lg overflow-hidden border-2 ${getCouleurCarburant(donnees.typeCarburant)}`}>
      <div className={`${getCouleurBadge(donnees.typeCarburant)} text-white px-4 py-3 flex justify-between items-center`}>
        <div>
          <p className="text-lg font-bold">{pistolet.replace('pistolet', 'Pistolet ')}</p>
          <p className="text-sm opacity-90">{donnees.typeCarburant}</p>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-90">Prix</p>
          <p className="text-lg font-bold">{prixUnitaire} HTG</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">
            INDEX DÉBUT
          </label>
          <input
            type="number"
            step="0.001"
            value={donnees.debut}
            onChange={(e) => mettreAJourLecture(pompe, pistolet, 'debut', e.target.value)}
            className="w-full px-4 py-3 text-lg font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.000"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">
            INDEX FIN
          </label>
          <input
            type="number"
            step="0.001"
            value={donnees.fin}
            onChange={(e) => mettreAJourLecture(pompe, pistolet, 'fin', e.target.value)}
            className="w-full px-4 py-3 text-lg font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.000"
          />
        </div>

        {(donnees.debut || donnees.fin) && (
          <div className="bg-white rounded-lg p-3 space-y-1 border-2 border-gray-300">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600">Gallons</span>
              <span className="text-xl font-bold text-gray-900">{formaterGallons(gallons)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-600">Ventes Total</span>
              <span className="text-xl font-bold text-green-600">{formaterArgent(ventes)} HTG</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant Saisie Propane (Nouveau)
const SaisiePropane = ({ shift, propaneDonnees, mettreAJourPropane, formaterArgent, prixPropane }) => {
  const gallons = (parseFloat(propaneDonnees.fin) || 0) - (parseFloat(propaneDonnees.debut) || 0);
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
              type="number"
              step="0.001"
              value={propaneDonnees.debut}
              onChange={(e) => mettreAJourPropane('debut', e.target.value)}
              className="w-full px-4 py-3 text-lg font-semibold border-2 border-white border-opacity-30 bg-white bg-opacity-10 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder-white placeholder-opacity-50"
              placeholder="0.000"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-white block mb-1">
              INDEX FIN PROPANE
            </label>
            <input
              type="number"
              step="0.001"
              value={propaneDonnees.fin}
              onChange={(e) => mettreAJourPropane('fin', e.target.value)}
              className="w-full px-4 py-3 text-lg font-semibold border-2 border-white border-opacity-30 bg-white bg-opacity-10 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder-white placeholder-opacity-50"
              placeholder="0.000"
            />
          </div>

          {(propaneDonnees.debut || propaneDonnees.fin) && (
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

// Composant Section USD
const SectionUSD = ({ shift, usdVentes, ajouterUSD, mettreAJourUSD, supprimerUSD, tauxUSD, formaterArgent }) => {
  const totalUSD = usdVentes[shift]?.reduce((total, usd) => total + (parseFloat(usd) || 0), 0) || 0;
  const totalHTG = totalUSD * tauxUSD;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe size={20} />
            <h3 className="text-lg font-bold">Ventes en USD - Shift {shift}</h3>
          </div>
          <button
            onClick={() => ajouterUSD()}
            className="bg-white text-amber-600 px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-1 active:scale-95 transition"
          >
            <Plus size={14} />
            Ajouter
          </button>
        </div>

        {/* Résumé USD */}
        <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs opacity-90">Total USD</p>
              <p className="text-xl font-bold">${formaterArgent(totalUSD)}</p>
            </div>
            <div>
              <p className="text-xs opacity-90">Équivalent HTG</p>
              <p className="text-xl font-bold">{formaterArgent(totalHTG)} HTG</p>
            </div>
          </div>
          <div className="text-xs opacity-90 mt-2 text-center">
            Taux: 1 USD = {tauxUSD} HTG
          </div>
        </div>

        {/* Entrées USD */}
        <div className="space-y-2">
          {(!usdVentes[shift] || usdVentes[shift].length === 0) ? (
            <div className="text-center py-3 text-white text-opacity-70 text-sm">
              Aucune vente en USD enregistrée
            </div>
          ) : (
            <div className="space-y-2">
              {usdVentes[shift].map((usd, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1 flex items-center bg-white bg-opacity-20 rounded-lg overflow-hidden">
                    <span className="px-3 py-2 font-bold text-white">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={usd}
                      onChange={(e) => mettreAJourUSD(index, e.target.value)}
                      placeholder="Montant USD"
                      className="flex-1 px-3 py-2 bg-transparent text-white text-right font-semibold placeholder-white placeholder-opacity-50"
                    />
                    <span className="px-2 py-2 font-bold text-sm text-white">=</span>
                    <span className="px-2 py-2 font-bold text-sm text-white">
                      {formaterArgent((parseFloat(usd) || 0) * tauxUSD)} HTG
                    </span>
                  </div>
                  <button
                    onClick={() => supprimerUSD(index)}
                    className="bg-red-500 text-white p-2 rounded-lg font-bold active:scale-95 transition"
                    aria-label={`Supprimer USD ${index + 1}`}
                  >
                    <Minus size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Note d'information */}
        <div className="mt-4 p-2 bg-white bg-opacity-10 rounded-lg text-xs">
          <p className="font-bold mb-1">Note:</p>
          <p>Les ventes en USD sont soustraites du total HTG pour l'équilibrage de caisse.</p>
        </div>
      </div>
    </div>
  );
};

// Composant Dépôts Vendeurs (réutilisable)
const DepotsVendeurs = ({ shift, vendeurs, totauxVendeurs, tousDepots, mettreAJourDepot, ajouterDepot, supprimerDepot, formaterArgent }) => {
  const depotsActuels = tousDepots[shift] || {};

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <DollarSign size={20} />
            <h3 className="text-lg font-bold">Dépôts - Shift {shift}</h3>
          </div>
        </div>

        <div className="space-y-4">
          {vendeurs.length === 0 ? (
            <div className="text-center py-6 text-white text-opacity-70">
              Aucun vendeur ajouté
            </div>
          ) : (
            vendeurs.map(vendeur => {
              const depots = depotsActuels[vendeur] || [];
              const depotsValides = depots.filter(depot => depot !== '');
              const totalDepot = depotsValides.reduce((sum, depot) => sum + (parseFloat(depot) || 0), 0);
              const donneesVendeur = totauxVendeurs[vendeur];
              const especesAttendues = donneesVendeur ? (donneesVendeur.ventesTotales - totalDepot) : 0;

              return (
                <div key={vendeur} className="bg-white bg-opacity-15 rounded-lg p-3 space-y-3">
                  {/* En-tête Vendeur */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                        <User size={16} />
                      </div>
                      <span className="font-bold">{vendeur}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold text-center ${
                      especesAttendues > 0 
                        ? 'bg-green-500' 
                        : especesAttendues < 0 
                        ? 'bg-red-500' 
                        : 'bg-gray-500'
                    }`}>
                      Espèces: {formaterArgent(especesAttendues)} HTG
                    </div>
                  </div>

                  {/* Info Ventes */}
                  <div className="bg-white bg-opacity-10 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-90">Ventes Total</span>
                      <span className="font-bold">{formaterArgent(donneesVendeur?.ventesTotales || 0)} HTG</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-90">Total Dépôts</span>
                      <span className="font-bold">{formaterArgent(totalDepot)} HTG</span>
                    </div>
                  </div>

                  {/* Entrées Dépôts */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">Entrées Dépôts</span>
                      <button
                        onClick={() => ajouterDepot(vendeur)}
                        className="bg-white text-indigo-600 px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-1 active:scale-95 transition"
                      >
                        <Plus size={14} />
                        Ajouter
                      </button>
                    </div>

                    {depots.length === 0 ? (
                      <div className="text-center py-3 text-white text-opacity-70 text-sm">
                        Aucun dépôt ajouté
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {depots.map((depot, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="flex-1 flex items-center bg-white bg-opacity-20 rounded-lg overflow-hidden">
                              <input
                                type="number"
                                step="0.01"
                                value={depot}
                                onChange={(e) => mettreAJourDepot(vendeur, index, e.target.value)}
                                placeholder="Montant"
                                className="flex-1 px-3 py-2 bg-transparent text-white text-right font-semibold placeholder-white placeholder-opacity-50"
                              />
                              <span className="px-2 py-2 font-bold text-sm">HTG</span>
                            </div>
                            <button
                              onClick={() => supprimerDepot(vendeur, index)}
                              className="bg-red-500 text-white p-2 rounded-lg font-bold active:scale-95 transition"
                              aria-label={`Supprimer dépôt ${index + 1}`}
                            >
                              <Minus size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Résumé Dépôts */}
                  {depotsValides.length > 0 && (
                    <div className="pt-3 border-t border-white border-opacity-30">
                      <div className="flex flex-col gap-1">
                        <div className="text-xs opacity-90">Dépôts individuels:</div>
                        <div className="flex flex-wrap gap-1">
                          {depotsValides.map((depot, idx) => (
                            <div 
                              key={idx} 
                              className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs flex items-center gap-1"
                            >
                              <span>{idx + 1}.</span>
                              <span>{formaterArgent(depot)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// Composant Affectation Vendeur (réutilisable)
const AffectationVendeur = ({ pompe, vendeurs, vendeurActuel, mettreAJourAffectation }) => {
  return (
    <div className="bg-white rounded-lg p-3 border-2 border-indigo-300 mb-3">
      <div className="flex items-center gap-2 mb-2">
        <User size={18} />
        <h4 className="text-base font-bold text-gray-800 truncate">Vendeur pour {pompe}</h4>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <select
          value={vendeurActuel}
          onChange={(e) => mettreAJourAffectation(pompe, e.target.value)}
          className="flex-1 px-3 py-2.5 text-base font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
        >
          <option value="">Sélectionner Vendeur</option>
          {vendeurs.map(vendeur => (
            <option key={vendeur} value={vendeur}>{vendeur}</option>
          ))}
        </select>
        {vendeurActuel && (
          <div className="bg-indigo-100 text-indigo-800 px-3 py-2 rounded-lg font-bold text-sm truncate max-w-full sm:w-auto w-full text-center">
            {vendeurActuel}
          </div>
        )}
      </div>
    </div>
  );
};

// Composant Détails Pompes par Shift (réutilisable)
const DetailsPompesShift = ({ shift, pompes, toutesDonnees, calculerTotalPompe, calculerGallons, getCouleurBadge, formaterGallons, formaterArgent }) => {
  return (
    <div className={`bg-gradient-to-br ${shift === 'AM' ? 'from-blue-500 to-indigo-600' : 'from-purple-500 to-indigo-600'} text-white rounded-xl p-4 shadow-xl`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{shift === 'AM' ? '🌅' : '🌇'}</span>
        <h3 className="text-lg font-bold">Détails Pompes - Shift {shift}</h3>
      </div>
      <div className="space-y-4">
        {pompes.map((pompe) => {
          const donneesPompe = toutesDonnees[shift][pompe];
          const totalPompe = calculerTotalPompe(donneesPompe);
          const numeroPompe = parseInt(pompe.replace('P', ''));
          const vendeurPompe = donneesPompe._vendeur || '';

          return (
            <div key={`${shift}-${pompe}`} className="bg-white bg-opacity-15 rounded-lg p-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h4 className="text-base font-bold">{pompe}</h4>
                  {vendeurPompe && (
                    <div className="flex items-center gap-1 mt-1">
                      <User size={12} />
                      <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded truncate">Vendeur: {vendeurPompe}</span>
                    </div>
                  )}
                </div>
                <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full self-start sm:self-center">{shift}</span>
              </div>

              <div className="space-y-2">
                {donneesPompe && Object.entries(donneesPompe).filter(([key]) => key !== '_vendeur').map(([pistolet, donnees]) => {
                  const gallons = calculerGallons(donnees.debut, donnees.fin);
                  if (gallons === 0 && !donnees.debut && !donnees.fin) return null;

                  return (
                    <div key={pistolet} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold truncate">{pistolet.replace('pistolet', 'P')}</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold flex-shrink-0 ${getCouleurBadge(donnees.typeCarburant)}`}>
                          {donnees.typeCarburant.replace('Essence ', 'E')}
                        </span>
                      </div>
                      <div className="text-right min-w-0">
                        <div className="font-bold truncate">{formaterGallons(gallons)} gal</div>
                        <div className="text-xs opacity-90 truncate">
                          {donnees.debut || '0'} → {donnees.fin || '0'}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Total Pompe */}
                {totalPompe && (totalPompe.totalGallons !== 0 || Object.values(donneesPompe).some(donnees => donnees && donnees.debut || donnees.fin)) && (
                  <div className="pt-2 mt-2 border-t border-white border-opacity-30">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm">Total {pompe}:</span>
                      <div className="text-right">
                        <div className="font-bold text-sm">{formaterGallons(totalPompe.totalGallons)} gal</div>
                        <div className="font-bold">{formaterArgent(totalPompe.ventesTotales)} HTG</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Composant Résumé Financier Vendeurs (réutilisable)
const ResumeFinancierVendeurs = ({ shift, vendeurs, totauxVendeurs, formaterArgent }) => {
  const donneesShift = totauxVendeurs[shift];
  if (!donneesShift) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-3 h-3 rounded-full ${shift === 'AM' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
        <h4 className="font-bold text-base">Vendeurs - Shift {shift}</h4>
      </div>
      <div className="space-y-3">
        {vendeurs.map(vendeur => {
          const donneesVendeur = donneesShift[vendeur];
          if (!donneesVendeur || donneesVendeur.ventesTotales === 0) return null;

          return (
            <div key={`${shift}-${vendeur}`} className="bg-white bg-opacity-15 rounded-lg p-3 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span className="font-bold truncate">{vendeur}</span>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-sm font-bold text-center min-w-[120px] ${
                  donneesVendeur.especesAttendues > 0 
                    ? 'bg-green-500' 
                    : donneesVendeur.especesAttendues < 0 
                    ? 'bg-red-500' 
                    : 'bg-gray-500'
                }`}>
                  Espèces: {formaterArgent(donneesVendeur.especesAttendues)}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="bg-white bg-opacity-10 rounded-lg p-2">
                  <p className="opacity-90 text-xs">Ventes Total</p>
                  <p className="font-bold text-base">{formaterArgent(donneesVendeur.ventesTotales)} HTG</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-2">
                  <p className="opacity-90 text-xs">Total Dépôts</p>
                  <p className="font-bold text-base">{formaterArgent(donneesVendeur.depot)} HTG</p>
                </div>
              </div>

              {donneesVendeur.depots && donneesVendeur.depots.length > 0 && (
                <div className="pt-2 border-t border-white border-opacity-30">
                  <p className="text-xs opacity-90 mb-1">Dépôts individuels:</p>
                  <div className="flex flex-wrap gap-1">
                    {donneesVendeur.depots.map((depot, idx) => (
                      <div key={idx} className="flex items-center gap-1 bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
                        <span>{idx + 1}.</span>
                        <span>{formaterArgent(depot)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Composant Principal
const SystemeStationService = () => {
  const [shift, setShift] = useState('AM');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [montrerDepots, setMontrerDepots] = useState(false);
  const [montrerVendeurs, setMontrerVendeurs] = useState(false);
  const [montrerRapport, setMontrerRapport] = useState(false);
  const [montrerUSD, setMontrerUSD] = useState(false);
  const [montrerPropane, setMontrerPropane] = useState(false);
  const [pompeEtendue, setPompeEtendue] = useState('P1');

  // Taux de change USD/HTG
  const tauxUSD = 132;
  // Prix Propane
  const prixPropane = 450;

  // Initialiser la structure des lectures de pompes avec champ vendeur
  const initialiserLecturesPompes = () => {
    const pompes = {};

    // Pompes 1-4: 6 pistolets avec types de carburant spécifiques
    for (let p = 1; p <= 4; p++) {
      pompes[`P${p}`] = {
        _vendeur: '', // Vendeur pour toute la pompe
        pistolet1: { typeCarburant: 'Essence 1', debut: '', fin: '' },
        pistolet2: { typeCarburant: 'Essence 2', debut: '', fin: '' },
        pistolet3: { typeCarburant: 'Diesel', debut: '', fin: '' },
        pistolet4: { typeCarburant: 'Essence 1', debut: '', fin: '' },
        pistolet5: { typeCarburant: 'Essence 2', debut: '', fin: '' },
        pistolet6: { typeCarburant: 'Diesel', debut: '', fin: '' }
      };
    }

    // Pompe 5: Seulement 1 pistolet - Essence seulement
    pompes['P5'] = {
      _vendeur: '', // Vendeur pour toute la pompe
      pistolet1: { typeCarburant: 'Essence', debut: '', fin: '' }
    };

    return pompes;
  };

  // Initialiser la structure de stockage pour propane
  const initialiserDonneesPropane = () => {
    return {
      debut: '',
      fin: ''
    };
  };

  // Initialiser la structure de stockage pour tous les shifts
  const initialiserTousShifts = () => {
    const cleStockage = `donneesStationService_${date}`;
    const donneesSauvegardees = localStorage.getItem(cleStockage);

    if (donneesSauvegardees) {
      try {
        const parse = JSON.parse(donneesSauvegardees);
        // S'assurer que toutes les pompes ont le champ _vendeur
        Object.keys(parse).forEach(shiftKey => {
          Object.keys(parse[shiftKey]).forEach(pompe => {
            if (!parse[shiftKey][pompe]._vendeur) {
              parse[shiftKey][pompe]._vendeur = '';
            }
          });
        });
        return parse;
      } catch (e) {
        console.error('Erreur parsing données sauvegardées:', e);
      }
    }

    return {
      AM: initialiserLecturesPompes(),
      PM: initialiserLecturesPompes()
    };
  };

  // Initialiser les données propane
  const initialiserPropaneDonnees = () => {
    const cleStockage = `propaneDonnees_${date}`;
    const donneesSauvegardees = localStorage.getItem(cleStockage);

    if (donneesSauvegardees) {
      try {
        const parse = JSON.parse(donneesSauvegardees);
        return parse;
      } catch (e) {
        console.error('Erreur parsing données propane:', e);
      }
    }

    return {
      AM: initialiserDonneesPropane(),
      PM: initialiserDonneesPropane()
    };
  };

  // Initialiser les vendeurs
  const initialiserVendeurs = () => {
    const cleStockage = 'vendeursStationService';
    const vendeursSauvegardes = localStorage.getItem(cleStockage);
    return vendeursSauvegardes ? JSON.parse(vendeursSauvegardes) : [];
  };

  // Initialiser les dépôts comme tableaux pour dépôts multiples
  const initialiserDepots = () => {
    const cleStockage = `depotsStationService_${date}`;
    const depotsSauvegardes = localStorage.getItem(cleStockage);

    if (depotsSauvegardes) {
      try {
        const parse = JSON.parse(depotsSauvegardes);
        // Convertir l'ancien format à tableau
        Object.keys(parse).forEach(shiftKey => {
          Object.keys(parse[shiftKey]).forEach(vendeur => {
            if (!Array.isArray(parse[shiftKey][vendeur])) {
              const depotUnique = parse[shiftKey][vendeur];
              parse[shiftKey][vendeur] = depotUnique ? [depotUnique] : [];
            }
            // Convertir les 0 en chaînes vides pour nouveaux inputs
            parse[shiftKey][vendeur] = parse[shiftKey][vendeur].map(depot => 
              depot === 0 ? '' : depot
            );
          });
        });
        return parse;
      } catch (e) {
        console.error('Erreur parsing dépôts sauvegardés:', e);
      }
    }

    return {
      AM: {},
      PM: {}
    };
  };

  // Initialiser les ventes USD
  const initialiserVentesUSD = () => {
    const cleStockage = `ventesUSD_${date}`;
    const ventesSauvegardees = localStorage.getItem(cleStockage);

    if (ventesSauvegardees) {
      try {
        const parse = JSON.parse(ventesSauvegardees);
        return parse;
      } catch (e) {
        console.error('Erreur parsing ventes USD:', e);
      }
    }

    return {
      AM: [],
      PM: []
    };
  };

  // États pour toutes les données
  const [toutesDonnees, setToutesDonnees] = useState(initialiserTousShifts());
  const [propaneDonnees, setPropaneDonnees] = useState(initialiserPropaneDonnees());
  const [vendeurs, setVendeurs] = useState(initialiserVendeurs());
  const [nouveauVendeur, setNouveauVendeur] = useState('');
  const [tousDepots, setTousDepots] = useState(initialiserDepots());
  const [ventesUSD, setVentesUSD] = useState(initialiserVentesUSD());

  const prix = {
    essence: 600,
    diesel: 650
  };

  const pompes = ['P1', 'P2', 'P3', 'P4', 'P5'];

  // Fonction pour compter les affectations de pompes pour un vendeur
  const getNombreAffectations = (nomVendeur) => {
    let count = 0;
    ['AM', 'PM'].forEach(shiftKey => {
      Object.values(toutesDonnees[shiftKey] || {}).forEach(donneesPompe => {
        if (donneesPompe._vendeur === nomVendeur) {
          count++;
        }
      });
    });
    return count;
  };

  // Formater nombre avec 3 décimales pour gallons
  const formaterGallons = (num) => {
    if (num === null || num === undefined || isNaN(num)) return '0.000';
    const nombre = typeof num === 'string' ? parseFloat(num) : num;
    return isNaN(nombre) ? '0.000' : nombre.toFixed(3);
  };

  // Formater nombre avec 2 décimales pour argent
  const formaterArgent = (num) => {
    if (num === null || num === undefined || isNaN(num)) return '0.00';
    const nombre = typeof num === 'string' ? parseFloat(num) : num;
    return isNaN(nombre) ? '0.00' : nombre.toFixed(2);
  };

  // Parser l'input gallons pour max 3 décimales
  const parserInputGallons = (valeur) => {
    if (!valeur) return '';
    // Retirer caractères non numériques sauf point décimal
    const valeurPropre = valeur.replace(/[^\d.]/g, '');
    // Un seul point décimal autorisé
    const parties = valeurPropre.split('.');
    if (parties.length > 2) {
      return parties[0] + '.' + parties.slice(1).join('');
    }
    // Limiter à 3 décimales
    if (parties[1] && parties[1].length > 3) {
      return parties[0] + '.' + parties[1].substring(0, 3);
    }
    return valeurPropre;
  };

  // Sauvegarder dans localStorage quand données changent
  useEffect(() => {
    const cleStockage = `donneesStationService_${date}`;
    localStorage.setItem(cleStockage, JSON.stringify(toutesDonnees));

    const clePropane = `propaneDonnees_${date}`;
    localStorage.setItem(clePropane, JSON.stringify(propaneDonnees));

    const cleDepots = `depotsStationService_${date}`;
    localStorage.setItem(cleDepots, JSON.stringify(tousDepots));

    const cleUSD = `ventesUSD_${date}`;
    localStorage.setItem(cleUSD, JSON.stringify(ventesUSD));

    localStorage.setItem('vendeursStationService', JSON.stringify(vendeurs));
  }, [toutesDonnees, propaneDonnees, tousDepots, ventesUSD, vendeurs, date]);

  // Initialiser nouvelles données quand date change
  useEffect(() => {
    setToutesDonnees(initialiserTousShifts());
    setPropaneDonnees(initialiserPropaneDonnees());
    setTousDepots(initialiserDepots());
    setVentesUSD(initialiserVentesUSD());
  }, [date]);

  // Obtenir les lectures du shift courant
  const obtenirLecturesCourantes = () => {
    return toutesDonnees[shift] || initialiserLecturesPompes();
  };

  const mettreAJourLecture = (pompe, pistolet, champ, valeur) => {
    // Parser input gallons pour limiter à 3 décimales
    const valeurParse = champ === 'debut' || champ === 'fin' ? parserInputGallons(valeur) : valeur;

    setToutesDonnees(prev => ({
      ...prev,
      [shift]: {
        ...prev[shift],
        [pompe]: {
          ...prev[shift][pompe],
          [pistolet]: {
            ...prev[shift][pompe][pistolet],
            [champ]: valeurParse
          }
        }
      }
    }));
  };

  const mettreAJourPropane = (champ, valeur) => {
    const valeurParse = parserInputGallons(valeur);
    
    setPropaneDonnees(prev => ({
      ...prev,
      [shift]: {
        ...prev[shift],
        [champ]: valeurParse
      }
    }));
  };

  const mettreAJourAffectationVendeur = (pompe, nomVendeur) => {
    setToutesDonnees(prev => ({
      ...prev,
      [shift]: {
        ...prev[shift],
        [pompe]: {
          ...prev[shift][pompe],
          _vendeur: nomVendeur
        }
      }
    }));
  };

  const mettreAJourDepot = (nomVendeur, index, valeur) => {
    setTousDepots(prev => {
      const nouveauxDepots = { ...prev };
      if (!nouveauxDepots[shift][nomVendeur]) {
        nouveauxDepots[shift][nomVendeur] = [];
      }
      // Stocker chaîne vide si valeur vide, sinon parser comme float
      nouveauxDepots[shift][nomVendeur][index] = valeur === '' ? '' : parseFloat(valeur) || 0;
      return nouveauxDepots;
    });
  };

  const ajouterDepot = (nomVendeur) => {
    setTousDepots(prev => {
      const nouveauxDepots = { ...prev };
      if (!nouveauxDepots[shift][nomVendeur]) {
        nouveauxDepots[shift][nomVendeur] = [];
      }
      // Ajouter chaîne vide au lieu de 0
      nouveauxDepots[shift][nomVendeur].push('');
      return nouveauxDepots;
    });
  };

  const supprimerDepot = (nomVendeur, index) => {
    setTousDepots(prev => {
      const nouveauxDepots = { ...prev };
      if (nouveauxDepots[shift][nomVendeur]) {
        nouveauxDepots[shift][nomVendeur] = nouveauxDepots[shift][nomVendeur].filter((_, i) => i !== index);
        if (nouveauxDepots[shift][nomVendeur].length === 0) {
          delete nouveauxDepots[shift][nomVendeur];
        }
      }
      return nouveauxDepots;
    });
  };

  // Gestion USD
  const ajouterUSD = () => {
    setVentesUSD(prev => ({
      ...prev,
      [shift]: [...(prev[shift] || []), '']
    }));
  };

  const mettreAJourUSD = (index, valeur) => {
    setVentesUSD(prev => ({
      ...prev,
      [shift]: prev[shift].map((usd, i) => i === index ? (valeur === '' ? '' : parseFloat(valeur) || 0) : usd)
    }));
  };

  const supprimerUSD = (index) => {
    setVentesUSD(prev => ({
      ...prev,
      [shift]: prev[shift].filter((_, i) => i !== index)
    }));
  };

  const ajouterVendeur = () => {
    if (nouveauVendeur.trim() && !vendeurs.includes(nouveauVendeur.trim())) {
      setVendeurs(prev => [...prev, nouveauVendeur.trim()]);
      setNouveauVendeur('');
    }
  };

  const supprimerVendeur = (nomVendeur) => {
    if (confirm(`Supprimer vendeur "${nomVendeur}"? Cela supprimera aussi ses affectations aux pompes.`)) {
      setVendeurs(prev => prev.filter(v => v !== nomVendeur));

      // Retirer vendeur de toutes les pompes
      const donneesMAJ = { ...toutesDonnees };
      Object.keys(donneesMAJ).forEach(shiftKey => {
        Object.keys(donneesMAJ[shiftKey]).forEach(pompe => {
          if (donneesMAJ[shiftKey][pompe]._vendeur === nomVendeur) {
            donneesMAJ[shiftKey][pompe]._vendeur = '';
          }
        });
      });
      setToutesDonnees(donneesMAJ);

      // Retirer dépôts du vendeur
      const depotsMAJ = { ...tousDepots };
      Object.keys(depotsMAJ).forEach(shiftKey => {
        if (depotsMAJ[shiftKey][nomVendeur]) {
          delete depotsMAJ[shiftKey][nomVendeur];
        }
      });
      setTousDepots(depotsMAJ);
    }
  };

  const calculerGallons = (debut, fin) => {
    const d = parseFloat(debut) || 0;
    const f = parseFloat(fin) || 0;
    return parseFloat((f - d).toFixed(3)); // Arrondir à 3 décimales
  };

  // Calculer propane pour un shift
  const calculerPropane = (donneesShift = null) => {
    const donnees = donneesShift || propaneDonnees[shift];
    const gallons = (parseFloat(donnees.fin) || 0) - (parseFloat(donnees.debut) || 0);
    const ventes = gallons * prixPropane;

    return {
      gallons: parseFloat(gallons.toFixed(3)),
      ventes: parseFloat(ventes.toFixed(2))
    };
  };

  // Calculer totaux pour un shift spécifique (avec propane)
  const calculerTotaux = (donneesShift = null, donneesPropaneShift = null) => {
    const donneesACalculer = donneesShift || obtenirLecturesCourantes();
    const propaneACalculer = donneesPropaneShift || propaneDonnees[shift];

    let totalGallonsEssence = 0;
    let totalGallonsDiesel = 0;
    let totalVentesEssence = 0;
    let totalVentesDiesel = 0;

    Object.entries(donneesACalculer).forEach(([pompe, donneesPompe]) => {
      Object.entries(donneesPompe).forEach(([key, donnees]) => {
        // Passer le champ _vendeur
        if (key === '_vendeur') return;

        const gallons = calculerGallons(donnees.debut, donnees.fin);

        if (donnees.typeCarburant.includes('Essence')) {
          totalGallonsEssence += gallons;
          totalVentesEssence += gallons * prix.essence;
        } else if (donnees.typeCarburant === 'Diesel') {
          totalGallonsDiesel += gallons;
          totalVentesDiesel += gallons * prix.diesel;
        }
      });
    });

    // Calculer propane pour ce shift
    const propane = calculerPropane(propaneACalculer);

    // Calculer USD pour ce shift
    const usdShift = ventesUSD[shift] || [];
    const totalUSD = usdShift.reduce((total, usd) => total + (parseFloat(usd) || 0), 0);
    const totalHTGenUSD = totalUSD * tauxUSD;

    // Total ajusté (HTG + Propane - USD converti)
    const totalBrut = totalVentesEssence + totalVentesDiesel + propane.ventes;
    const totalAjuste = totalBrut - totalHTGenUSD;

    return {
      totalGallonsEssence: parseFloat(totalGallonsEssence.toFixed(3)),
      totalGallonsDiesel: parseFloat(totalGallonsDiesel.toFixed(3)),
      totalVentesEssence: parseFloat(totalVentesEssence.toFixed(2)),
      totalVentesDiesel: parseFloat(totalVentesDiesel.toFixed(2)),
      propaneGallons: propane.gallons,
      propaneVentes: propane.ventes,
      totalUSD: parseFloat(totalUSD.toFixed(2)),
      totalHTGenUSD: parseFloat(totalHTGenUSD.toFixed(2)),
      totalBrut: parseFloat(totalBrut.toFixed(2)),
      totalAjuste: parseFloat(totalAjuste.toFixed(2))
    };
  };

  // Calculer totaux par pompe pour un shift spécifique
  const calculerTotalPompe = (donneesPompe) => {
    if (!donneesPompe) return null;

    let gallonsEssence = 0;
    let gallonsDiesel = 0;
    let ventesEssence = 0;
    let ventesDiesel = 0;

    Object.entries(donneesPompe).forEach(([key, donnees]) => {
      // Passer le champ _vendeur
      if (key === '_vendeur') return;

      const gallons = calculerGallons(donnees.debut, donnees.fin);

      if (donnees.typeCarburant.includes('Essence')) {
        gallonsEssence += gallons;
        ventesEssence += gallons * prix.essence;
      } else if (donnees.typeCarburant === 'Diesel') {
        gallonsDiesel += gallons;
        ventesDiesel += gallons * prix.diesel;
      }
    });

    return {
      gallonsEssence: parseFloat(gallonsEssence.toFixed(3)),
      gallonsDiesel: parseFloat(gallonsDiesel.toFixed(3)),
      ventesEssence: parseFloat(ventesEssence.toFixed(2)),
      ventesDiesel: parseFloat(ventesDiesel.toFixed(2)),
      totalGallons: parseFloat((gallonsEssence + gallonsDiesel).toFixed(3)),
      ventesTotales: parseFloat((ventesEssence + ventesDiesel).toFixed(2))
    };
  };

  // Calculer totaux vendeurs pour tous les shifts
  const calculerTotauxVendeurs = () => {
    const totauxVendeurs = {
      AM: {},
      PM: {}
    };

    // Initialiser tous les vendeurs pour les deux shifts
    vendeurs.forEach(vendeur => {
      totauxVendeurs.AM[vendeur] = {
        gallonsEssence: 0,
        gallonsDiesel: 0,
        ventesEssence: 0,
        ventesDiesel: 0,
        ventesTotales: 0,
        depot: 0,
        depots: [],
        especesAttendues: 0
      };

      totauxVendeurs.PM[vendeur] = {
        gallonsEssence: 0,
        gallonsDiesel: 0,
        ventesEssence: 0,
        ventesDiesel: 0,
        ventesTotales: 0,
        depot: 0,
        depots: [],
        especesAttendues: 0
      };
    });

    // Calculer ventes par vendeur par shift
    ['AM', 'PM'].forEach(shiftKey => {
      Object.entries(toutesDonnees[shiftKey]).forEach(([pompe, donneesPompe]) => {
        const vendeur = donneesPompe._vendeur;

        if (vendeur && totauxVendeurs[shiftKey][vendeur]) {
          Object.entries(donneesPompe).forEach(([key, donnees]) => {
            // Passer le champ _vendeur
            if (key === '_vendeur') return;

            const gallons = calculerGallons(donnees.debut, donnees.fin);

            if (donnees.typeCarburant.includes('Essence')) {
              totauxVendeurs[shiftKey][vendeur].gallonsEssence += gallons;
              totauxVendeurs[shiftKey][vendeur].ventesEssence += gallons * prix.essence;
            } else if (donnees.typeCarburant === 'Diesel') {
              totauxVendeurs[shiftKey][vendeur].gallonsDiesel += gallons;
              totauxVendeurs[shiftKey][vendeur].ventesDiesel += gallons * prix.diesel;
            }
          });

          // Obtenir dépôts - filtrer chaînes vides
          const depots = (tousDepots[shiftKey]?.[vendeur] || []).filter(depot => depot !== '');
          const depotsValides = depots.map(depot => parseFloat(depot) || 0);
          const totalDepot = depotsValides.reduce((sum, depot) => sum + depot, 0);

          // Mettre à jour totaux
          const donneesVendeur = totauxVendeurs[shiftKey][vendeur];
          donneesVendeur.gallonsEssence = parseFloat(donneesVendeur.gallonsEssence.toFixed(3));
          donneesVendeur.gallonsDiesel = parseFloat(donneesVendeur.gallonsDiesel.toFixed(3));
          donneesVendeur.ventesEssence = parseFloat(donneesVendeur.ventesEssence.toFixed(2));
          donneesVendeur.ventesDiesel = parseFloat(donneesVendeur.ventesDiesel.toFixed(2));
          donneesVendeur.ventesTotales = parseFloat((donneesVendeur.ventesEssence + donneesVendeur.ventesDiesel).toFixed(2));
          donneesVendeur.depot = parseFloat(totalDepot.toFixed(2));
          donneesVendeur.depots = depotsValides;
          donneesVendeur.especesAttendues = parseFloat((donneesVendeur.ventesTotales - donneesVendeur.depot).toFixed(2));
        }
      });
    });

    return totauxVendeurs;
  };

  const reinitialiserFormulaire = () => {
    if (confirm('Voulez-vous vraiment réinitialiser TOUTES les données pour aujourd\'hui?')) {
      setToutesDonnees({
        AM: initialiserLecturesPompes(),
        PM: initialiserLecturesPompes()
      });
      setPropaneDonnees({
        AM: initialiserDonneesPropane(),
        PM: initialiserDonneesPropane()
      });
      setTousDepots({
        AM: {},
        PM: {}
      });
      setVentesUSD({
        AM: [],
        PM: []
      });
      setMontrerRapport(false);
      setMontrerDepots(false);
      setMontrerUSD(false);
      setMontrerPropane(false);
    }
  };

  const reinitialiserShiftCourant = () => {
    if (confirm(`Voulez-vous vraiment réinitialiser les données du shift ${shift}?`)) {
      setToutesDonnees(prev => ({
        ...prev,
        [shift]: initialiserLecturesPompes()
      }));
      setPropaneDonnees(prev => ({
        ...prev,
        [shift]: initialiserDonneesPropane()
      }));
      setTousDepots(prev => ({
        ...prev,
        [shift]: {}
      }));
      setVentesUSD(prev => ({
        ...prev,
        [shift]: []
      }));
    }
  };

  const totaux = calculerTotaux();
  const lecturesCourantes = obtenirLecturesCourantes();
  const totauxVendeurs = calculerTotauxVendeurs();
  const totauxVendeursCourants = totauxVendeurs[shift];

  // Calculer totaux quotidiens (AM + PM)
  const totauxAM = calculerTotaux(toutesDonnees.AM, propaneDonnees.AM);
  const totauxPM = calculerTotaux(toutesDonnees.PM, propaneDonnees.PM);

  const totauxQuotidiens = {
    gallonsEssence: parseFloat((totauxAM.totalGallonsEssence + totauxPM.totalGallonsEssence).toFixed(3)),
    gallonsDiesel: parseFloat((totauxAM.totalGallonsDiesel + totauxPM.totalGallonsDiesel).toFixed(3)),
    propaneGallons: parseFloat((totauxAM.propaneGallons + totauxPM.propaneGallons).toFixed(3)),
    ventesEssence: parseFloat((totauxAM.totalVentesEssence + totauxPM.totalVentesEssence).toFixed(2)),
    ventesDiesel: parseFloat((totauxAM.totalVentesDiesel + totauxPM.totalVentesDiesel).toFixed(2)),
    propaneVentes: parseFloat((totauxAM.propaneVentes + totauxPM.propaneVentes).toFixed(2)),
    totalUSD: parseFloat((totauxAM.totalUSD + totauxPM.totalUSD).toFixed(2)),
    totalHTGenUSD: parseFloat((totauxAM.totalHTGenUSD + totauxPM.totalHTGenUSD).toFixed(2)),
  };
  totauxQuotidiens.totalBrut = parseFloat((totauxQuotidiens.ventesEssence + totauxQuotidiens.ventesDiesel + totauxQuotidiens.propaneVentes).toFixed(2));
  totauxQuotidiens.totalAjuste = parseFloat((totauxQuotidiens.totalBrut - totauxQuotidiens.totalHTGenUSD).toFixed(2));

  const getCouleurCarburant = (typeCarburant) => {
    if (typeCarburant === 'Diesel') return 'bg-amber-100 border-amber-400';
    if (typeCarburant === 'Essence 1') return 'bg-emerald-100 border-emerald-400';
    if (typeCarburant === 'Essence 2') return 'bg-sky-100 border-sky-400';
    return 'bg-purple-100 border-purple-400';
  };

  const getCouleurBadge = (typeCarburant) => {
    if (typeCarburant === 'Diesel') return 'bg-amber-500';
    if (typeCarburant === 'Essence 1') return 'bg-emerald-500';
    if (typeCarburant === 'Essence 2') return 'bg-sky-500';
    return 'bg-purple-500';
  };

  const getCouleurPompe = (numeroPompe) => {
    const couleurs = [
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-emerald-500 to-emerald-600',
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-amber-500 to-amber-600',
      'bg-gradient-to-br from-rose-500 to-rose-600'
    ];
    return couleurs[numeroPompe - 1] || couleurs[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pb-20">
      {/* En-tête avec défilement horizontal */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <Fuel size={28} />
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold truncate">Station Service</h1>
            <p className="text-xs text-blue-100 truncate">Gestion Ventes & Vendeurs</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 text-sm bg-white text-gray-900 rounded-lg font-semibold w-full"
          />

          <select
            value={shift}
            onChange={(e) => {
              setShift(e.target.value);
              setPompeEtendue('P1');
            }}
            className="px-3 py-2 text-sm bg-white text-gray-900 rounded-lg font-semibold w-full"
          >
            <option value="AM">Shift Matin</option>
            <option value="PM">Shift Soir</option>
          </select>
        </div>

        {/* Barre de navigation avec défilement horizontal */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1 min-w-max">
            <button
              onClick={() => {
                setMontrerRapport(!montrerRapport);
                setMontrerVendeurs(false);
                setMontrerDepots(false);
                setMontrerUSD(false);
                setMontrerPropane(false);
              }}
              className="bg-white text-blue-600 px-3 py-2.5 rounded-lg font-bold text-xs flex flex-col items-center justify-center gap-0.5 active:scale-95 transition min-h-[60px] min-w-[70px]"
            >
              <FileText size={16} />
              <span>{montrerRapport ? 'Données' : 'Rapport'}</span>
            </button>
            <button
              onClick={() => {
                setMontrerVendeurs(!montrerVendeurs);
                setMontrerRapport(false);
                setMontrerDepots(false);
                setMontrerUSD(false);
                setMontrerPropane(false);
              }}
              className="bg-purple-500 text-white px-3 py-2.5 rounded-lg font-bold text-xs flex flex-col items-center justify-center gap-0.5 active:scale-95 transition min-h-[60px] min-w-[70px]"
            >
              <Users size={16} />
              <span>Vendeurs</span>
            </button>
            <button
              onClick={() => {
                setMontrerDepots(!montrerDepots);
                setMontrerRapport(false);
                setMontrerVendeurs(false);
                setMontrerUSD(false);
                setMontrerPropane(false);
              }}
              className="bg-green-500 text-white px-3 py-2.5 rounded-lg font-bold text-xs flex flex-col items-center justify-center gap-0.5 active:scale-95 transition min-h-[60px] min-w-[70px]"
            >
              <DollarSign size={16} />
              <span>Dépôts</span>
            </button>
            <button
              onClick={() => {
                setMontrerUSD(!montrerUSD);
                setMontrerRapport(false);
                setMontrerVendeurs(false);
                setMontrerDepots(false);
                setMontrerPropane(false);
              }}
              className="bg-amber-500 text-white px-3 py-2.5 rounded-lg font-bold text-xs flex flex-col items-center justify-center gap-0.5 active:scale-95 transition min-h-[60px] min-w-[70px]"
            >
              <Globe size={16} />
              <span>USD</span>
            </button>
            <button
              onClick={() => {
                setMontrerPropane(!montrerPropane);
                setMontrerRapport(false);
                setMontrerVendeurs(false);
                setMontrerDepots(false);
                setMontrerUSD(false);
              }}
              className="bg-red-500 text-white px-3 py-2.5 rounded-lg font-bold text-xs flex flex-col items-center justify-center gap-0.5 active:scale-95 transition min-h-[60px] min-w-[70px]"
            >
              <Flame size={16} />
              <span>Propane</span>
            </button>
            <button
              onClick={reinitialiserShiftCourant}
              className="bg-orange-500 text-white px-3 py-2.5 rounded-lg font-bold text-xs flex flex-col items-center justify-center gap-0.5 active:scale-95 transition min-h-[60px] min-w-[70px]"
            >
              <Trash2 size={16} />
              <span>Reset {shift}</span>
            </button>
            <button
              onClick={reinitialiserFormulaire}
              className="bg-red-500 text-white px-3 py-2.5 rounded-lg font-bold text-xs flex flex-col items-center justify-center gap-0.5 active:scale-95 transition min-h-[60px] min-w-[70px]"
            >
              <Trash2 size={16} />
              <span>Reset Jour</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {montrerVendeurs ? (
          <GestionVendeurs
            vendeurs={vendeurs}
            nouveauVendeur={nouveauVendeur}
            setNouveauVendeur={setNouveauVendeur}
            ajouterVendeur={ajouterVendeur}
            supprimerVendeur={supprimerVendeur}
            getNombreAffectations={getNombreAffectations}
          />
        ) : montrerDepots ? (
          <DepotsVendeurs
            shift={shift}
            vendeurs={vendeurs}
            totauxVendeurs={totauxVendeursCourants}
            tousDepots={tousDepots}
            mettreAJourDepot={mettreAJourDepot}
            ajouterDepot={ajouterDepot}
            supprimerDepot={supprimerDepot}
            formaterArgent={formaterArgent}
          />
        ) : montrerUSD ? (
          <SectionUSD
            shift={shift}
            usdVentes={ventesUSD}
            ajouterUSD={ajouterUSD}
            mettreAJourUSD={mettreAJourUSD}
            supprimerUSD={supprimerUSD}
            tauxUSD={tauxUSD}
            formaterArgent={formaterArgent}
          />
        ) : montrerPropane ? (
          <SaisiePropane
            shift={shift}
            propaneDonnees={propaneDonnees[shift]}
            mettreAJourPropane={mettreAJourPropane}
            formaterArgent={formaterArgent}
            prixPropane={prixPropane}
          />
        ) : !montrerRapport ? (
          <div className="space-y-3">
            {/* Indicateur Shift */}
            <div className="bg-slate-800 text-white rounded-lg p-3 text-center">
              <div className="text-sm opacity-90">Shift Actuel</div>
              <div className="text-xl font-bold">SHIFT {shift}</div>
            </div>

            {/* Statistiques Rapides */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-4 shadow-lg">
                <p className="text-xs opacity-90 mb-1">Essence ({shift})</p>
                <p className="text-2xl font-bold">{formaterGallons(totaux.totalGallonsEssence)}</p>
                <p className="text-xs opacity-90">gallons</p>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl p-4 shadow-lg">
                <p className="text-xs opacity-90 mb-1">Diesel ({shift})</p>
                <p className="text-2xl font-bold">{formaterGallons(totaux.totalGallonsDiesel)}</p>
                <p className="text-xs opacity-90">gallons</p>
              </div>
            </div>

            {/* Total USD Ajusté avec Propane */}
            <div className="bg-gradient-to-br from-amber-600 to-orange-600 text-white rounded-xl p-4 shadow-lg">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-xs opacity-90 mb-1">Total Ajusté ({shift})</p>
                  <p className="text-2xl font-bold">{formaterArgent(totaux.totalAjuste)} HTG</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-90">USD: ${formaterArgent(totaux.totalUSD)}</p>
                  <p className="text-xs">= {formaterArgent(totaux.totalHTGenUSD)} HTG</p>
                </div>
              </div>
              <div className="pt-2 border-t border-white border-opacity-30">
                <div className="flex justify-between items-center">
                  <span className="text-xs opacity-90">Propane: {formaterArgent(totaux.propaneVentes)} HTG</span>
                  <span className="text-xs opacity-90">Brut: {formaterArgent(totaux.totalBrut)} HTG</span>
                </div>
              </div>
            </div>

            {/* Sélecteur Pompes */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {pompes.map((pompe) => (
                <button
                  key={pompe}
                  onClick={() => setPompeEtendue(pompe)}
                  className={`px-4 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition ${
                    pompeEtendue === pompe
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'bg-slate-700 text-white'
                  }`}
                >
                  {pompe}
                </button>
              ))}
            </div>

            {/* Pistolets pour Pompe Sélectionnée */}
            {Object.entries(lecturesCourantes).map(([pompe, donneesPompe]) => {
              if (pompe !== pompeEtendue) return null;

              const totalPompe = calculerTotalPompe(donneesPompe);
              const numeroPompe = parseInt(pompe.replace('P', ''));
              const vendeurActuel = donneesPompe._vendeur || '';

              return (
                <div key={pompe} className="space-y-3">
                  {/* Affectation Vendeur */}
                  <AffectationVendeur
                    pompe={pompe}
                    vendeurs={vendeurs}
                    vendeurActuel={vendeurActuel}
                    mettreAJourAffectation={mettreAJourAffectationVendeur}
                  />

                  {/* En-tête Pompe avec Total */}
                  <EnTetePompe
                    pompe={pompe}
                    shift={shift}
                    totalPompe={totalPompe}
                    numeroPompe={numeroPompe}
                    getCouleurPompe={getCouleurPompe}
                    formaterArgent={formaterArgent}
                    formaterGallons={formaterGallons}
                    prix={prix}
                  />

                  {/* Saisies Pistolets */}
                  <div className="space-y-3">
                    {Object.entries(donneesPompe).filter(([key]) => key !== '_vendeur').map(([pistolet, donnees]) => (
                      <SaisiePistolet
                        key={pistolet}
                        pistolet={pistolet}
                        donnees={donnees}
                        pompe={pompe}
                        mettreAJourLecture={mettreAJourLecture}
                        getCouleurCarburant={getCouleurCarburant}
                        getCouleurBadge={getCouleurBadge}
                        prix={prix}
                        calculerGallons={calculerGallons}
                        formaterGallons={formaterGallons}
                        formaterArgent={formaterArgent}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cartes Résumé */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl p-5 shadow-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calculator size={24} />
                Résumé Quotidien - {date}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm opacity-90">Shift Matin</p>
                  <p className="text-lg font-bold">{formaterArgent(totauxAM.totalAjuste)} HTG</p>
                  <p className="text-xs opacity-90">USD: ${formaterArgent(totauxAM.totalUSD)}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Shift Soir</p>
                  <p className="text-lg font-bold">{formaterArgent(totauxPM.totalAjuste)} HTG</p>
                  <p className="text-xs opacity-90">USD: ${formaterArgent(totauxPM.totalUSD)}</p>
                </div>
              </div>
            </div>

            {/* Résumé USD Quotidien */}
            <div className="bg-gradient-to-br from-amber-600 to-orange-600 text-white rounded-xl p-5 shadow-xl">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Globe size={20} />
                Ventes USD - Total Quotidien
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <p className="text-xs opacity-90">Shift Matin</p>
                    <p className="text-lg font-bold">${formaterArgent(totauxAM.totalUSD)}</p>
                    <p className="text-sm opacity-90">{formaterArgent(totauxAM.totalHTGenUSD)} HTG</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <p className="text-xs opacity-90">Shift Soir</p>
                    <p className="text-lg font-bold">${formaterArgent(totauxPM.totalUSD)}</p>
                    <p className="text-sm opacity-90">{formaterArgent(totauxPM.totalHTGenUSD)} HTG</p>
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Total USD:</span>
                    <span className="text-xl font-bold">${formaterArgent(totauxQuotidiens.totalUSD)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-white border-opacity-30">
                    <span className="font-bold">Total HTG (USD):</span>
                    <span className="text-xl font-bold">{formaterArgent(totauxQuotidiens.totalHTGenUSD)} HTG</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Résumé Propane Quotidien */}
            <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white rounded-xl p-5 shadow-xl">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Flame size={20} />
                Propane - Total Quotidien
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <p className="text-xs opacity-90">Shift Matin</p>
                    <p className="text-lg font-bold">{totauxAM.propaneGallons.toFixed(3)} gal</p>
                    <p className="text-sm opacity-90">{formaterArgent(totauxAM.propaneVentes)} HTG</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <p className="text-xs opacity-90">Shift Soir</p>
                    <p className="text-lg font-bold">{totauxPM.propaneGallons.toFixed(3)} gal</p>
                    <p className="text-sm opacity-90">{formaterArgent(totauxPM.propaneVentes)} HTG</p>
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Total Gallons:</span>
                    <span className="text-xl font-bold">{totauxQuotidiens.propaneGallons.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-white border-opacity-30">
                    <span className="font-bold">Total Ventes Propane:</span>
                    <span className="text-xl font-bold">{formaterArgent(totauxQuotidiens.propaneVentes)} HTG</span>
                  </div>
                  <div className="text-center text-xs opacity-90 mt-2">
                    Prix: {prixPropane} HTG par gallon
                  </div>
                </div>
              </div>
            </div>

            {/* Résumé Financier Vendeurs */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-5 shadow-xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <User size={20} />
                Résumé Financier Vendeurs
              </h3>

              <ResumeFinancierVendeurs
                shift="AM"
                vendeurs={vendeurs}
                totauxVendeurs={totauxVendeurs}
                formaterArgent={formaterArgent}
              />

              <ResumeFinancierVendeurs
                shift="PM"
                vendeurs={vendeurs}
                totauxVendeurs={totauxVendeurs}
                formaterArgent={formaterArgent}
              />
            </div>

            {/* Détails Pompes Shift Matin */}
            <DetailsPompesShift
              shift="AM"
              pompes={pompes}
              toutesDonnees={toutesDonnees}
              calculerTotalPompe={calculerTotalPompe}
              calculerGallons={calculerGallons}
              getCouleurBadge={getCouleurBadge}
              formaterGallons={formaterGallons}
              formaterArgent={formaterArgent}
            />

            {/* Détails Pompes Shift Soir */}
            <DetailsPompesShift
              shift="PM"
              pompes={pompes}
              toutesDonnees={toutesDonnees}
              calculerTotalPompe={calculerTotalPompe}
              calculerGallons={calculerGallons}
              getCouleurBadge={getCouleurBadge}
              formaterGallons={formaterGallons}
              formaterArgent={formaterArgent}
            />

            {/* Totaux Essence Quotidiens */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-5 shadow-xl">
              <h3 className="text-lg font-bold mb-3">💚 Essence - Total Quotidien</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Gallons</span>
                  <span className="font-bold">{formaterGallons(totauxQuotidiens.gallonsEssence)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Prix/Gallon</span>
                  <span className="font-bold">600 HTG</span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t border-white border-opacity-30">
                  <span className="font-bold">Ventes Brutes</span>
                  <span className="font-bold">{formaterArgent(totauxQuotidiens.ventesEssence)} HTG</span>
                </div>
              </div>
            </div>

            {/* Totaux Diesel Quotidiens */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl p-5 shadow-xl">
              <h3 className="text-lg font-bold mb-3">⚡ Diesel - Total Quotidien</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Gallons</span>
                  <span className="font-bold">{formaterGallons(totauxQuotidiens.gallonsDiesel)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Prix/Gallon</span>
                  <span className="font-bold">650 HTG</span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t border-white border-opacity-30">
                  <span className="font-bold">Ventes Brutes</span>
                  <span className="font-bold">{formaterArgent(totauxQuotidiens.ventesDiesel)} HTG</span>
                </div>
              </div>
            </div>

            {/* Total Final Ajusté avec Propane */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl p-5 shadow-xl">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">TOTAL BRUT (HTG)</span>
                  <span className="text-2xl font-bold">{formaterArgent(totauxQuotidiens.totalBrut)} HTG</span>
                </div>
                <div className="space-y-1 pl-2 border-l-2 border-white border-opacity-30 ml-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="opacity-90">• Essence</span>
                    <span>{formaterArgent(totauxQuotidiens.ventesEssence)} HTG</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="opacity-90">• Diesel</span>
                    <span>{formaterArgent(totauxQuotidiens.ventesDiesel)} HTG</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="opacity-90">• Propane</span>
                    <span>{formaterArgent(totauxQuotidiens.propaneVentes)} HTG</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white border-opacity-30">
                  <span className="text-sm opacity-90">Moins: USD converti</span>
                  <span className="text-sm">- {formaterArgent(totauxQuotidiens.totalHTGenUSD)} HTG</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold">TOTAL FINAL AJUSTÉ</span>
                  <span className="text-2xl font-bold">{formaterArgent(totauxQuotidiens.totalAjuste)} HTG</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemeStationService;