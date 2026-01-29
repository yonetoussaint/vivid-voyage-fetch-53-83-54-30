import { useState, useMemo } from "react";

export default function Rapport({ 
  date, 
  shift, 
  toutesDonnees,
  // Add other props as needed from your system
}) {
  // You can use the props from your system
  console.log('Rapport props:', { date, shift, toutesDonnees });

  const [venteBrute, setVenteBrute] = useState(500000);
  const [prixOfficiel, setPrixOfficiel] = useState(650);
  const [prixSpecial, setPrixSpecial] = useState(625);
  const [gallons, setGallons] = useState(80);
  const [payeAvantCloture, setPayeAvantCloture] = useState(true);
  const [credits, setCredits] = useState([]);
  const [ventesDifferees, setVentesDifferees] = useState([]);

  const addCredit = () => {
    setCredits([...credits, { id: Date.now(), description: '', montant: 0 }]);
  };

  const updateCredit = (id, field, value) => {
    setCredits(credits.map(credit => 
      credit.id === id ? { ...credit, [field]: value } : credit
    ));
  };

  const removeCredit = (id) => {
    setCredits(credits.filter(credit => credit.id !== id));
  };

  const addVenteDifferee = () => {
    setVentesDifferees([...ventesDifferees, { id: Date.now(), description: '', montant: 0 }]);
  };

  const updateVenteDifferee = (id, field, value) => {
    setVentesDifferees(ventesDifferees.map(vente => 
      vente.id === id ? { ...vente, [field]: value } : vente
    ));
  };

  const removeVenteDifferee = (id) => {
    setVentesDifferees(ventesDifferees.filter(vente => vente.id !== id));
  };

  const calculs = useMemo(() => {
    const valeurOfficielle = gallons * prixOfficiel;
    const valeurSpeciale = gallons * prixSpecial;
    const remise = valeurOfficielle - valeurSpeciale;

    const venteNette = venteBrute - remise;

    const creditDuJour = payeAvantCloture ? 0 : valeurSpeciale;
    const creditsPrecedents = credits.reduce((sum, credit) => sum + (Number(credit.montant) || 0), 0);
    const ventesDiffereesTotal = ventesDifferees.reduce((sum, vente) => sum + (Number(vente.montant) || 0), 0);
    const creditTotal = creditDuJour + creditsPrecedents + ventesDiffereesTotal;
    const cashPhysique = venteNette - creditDuJour - ventesDiffereesTotal;

    return {
      valeurOfficielle,
      valeurSpeciale,
      remise,
      venteNette,
      creditDuJour,
      creditsPrecedents,
      ventesDiffereesTotal,
      creditTotal,
      cashPhysique,
    };
  }, [venteBrute, prixOfficiel, prixSpecial, gallons, payeAvantCloture, credits, ventesDifferees]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 mb-4 border border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
            Rapport Journalier Gaz
          </h1>
          <p className="text-gray-500 text-center mt-1">
            Date: {date} | Shift: {shift}
          </p>
        </div>

        {/* Main Inputs Card */}
        <div className="bg-white rounded-2xl p-6 mb-4 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Données du jour</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vente brute (pompe)
              </label>
              <input 
                type="number" 
                value={venteBrute} 
                onChange={e => setVenteBrute(+e.target.value)} 
                className="w-full px-4 py-3 text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
                inputMode="decimal"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix officiel
                </label>
                <input 
                  type="number" 
                  value={prixOfficiel} 
                  onChange={e => setPrixOfficiel(+e.target.value)} 
                  className="w-full px-4 py-3 text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
                  inputMode="decimal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix spécial
                </label>
                <input 
                  type="number" 
                  value={prixSpecial} 
                  onChange={e => setPrixSpecial(+e.target.value)} 
                  className="w-full px-4 py-3 text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
                  inputMode="decimal"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gallons à prix spécial
              </label>
              <input 
                type="number" 
                value={gallons} 
                onChange={e => setGallons(+e.target.value)} 
                className="w-full px-4 py-3 text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
                inputMode="decimal"
              />
            </div>

            <label className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors">
              <input
                type="checkbox"
                checked={payeAvantCloture}
                onChange={e => setPayeAvantCloture(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Payé avant la clôture</span>
            </label>
          </div>
        </div>

        {/* Credits Section */}
        <div className="bg-white rounded-2xl p-6 mb-4 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Crédits précédents</h2>
            <button
              onClick={addCredit}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              + Ajouter
            </button>
          </div>

          {credits.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              Aucun crédit ajouté
            </div>
          ) : (
            <div className="space-y-3">
              {credits.map((credit) => (
                <div key={credit.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <input
                    type="text"
                    placeholder="Description"
                    value={credit.description}
                    onChange={e => updateCredit(credit.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 mb-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Montant"
                      value={credit.montant || ''}
                      onChange={e => updateCredit(credit.id, 'montant', +e.target.value)}
                      className="flex-1 min-w-0 px-3 py-2 text-base font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      inputMode="decimal"
                    />
                    <button
                      onClick={() => removeCredit(credit.id)}
                      className="flex-shrink-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}

              {credits.length > 0 && (
                <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Total:</span>
                  <span className="text-lg font-bold text-gray-900">{calculs.creditsPrecedents.toLocaleString()} GDS</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Deferred Sales Section */}
        <div className="bg-white rounded-2xl p-6 mb-4 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Ventes à paiement différée</h2>
            <button
              onClick={addVenteDifferee}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              + Ajouter
            </button>
          </div>

          {ventesDifferees.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              Aucune vente différée ajoutée
            </div>
          ) : (
            <div className="space-y-3">
              {ventesDifferees.map((vente) => (
                <div key={vente.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <input
                    type="text"
                    placeholder="Description"
                    value={vente.description}
                    onChange={e => updateVenteDifferee(vente.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 mb-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Montant"
                      value={vente.montant || ''}
                      onChange={e => updateVenteDifferee(vente.id, 'montant', +e.target.value)}
                      className="flex-1 min-w-0 px-3 py-2 text-base font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      inputMode="decimal"
                    />
                    <button
                      onClick={() => removeVenteDifferee(vente.id)}
                      className="flex-shrink-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}

              {ventesDifferees.length > 0 && (
                <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Total:</span>
                  <span className="text-lg font-bold text-gray-900">{calculs.ventesDiffereesTotal.toLocaleString()} GDS</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Card */}
        <div className="bg-white rounded-2xl p-6 mb-4 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Résultats</h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Valeur officielle</span>
              <span className="text-base font-semibold text-gray-900">{calculs.valeurOfficielle.toLocaleString()} GDS</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Valeur facturée</span>
              <span className="text-base font-semibold text-gray-900">{calculs.valeurSpeciale.toLocaleString()} GDS</span>
            </div>

            <div className="flex justify-between items-center py-2 border-t border-gray-100">
              <span className="text-sm text-gray-600">Remise accordée</span>
              <span className="text-base font-semibold text-red-600">-{calculs.remise.toLocaleString()} GDS</span>
            </div>

            <div className="flex justify-between items-center py-2 border-t border-gray-100">
              <span className="text-sm font-medium text-gray-700">Vente nette réelle</span>
              <span className="text-lg font-bold text-gray-900">{calculs.venteNette.toLocaleString()} GDS</span>
            </div>

            {calculs.creditsPrecedents > 0 && (
              <div className="flex justify-between items-center py-2 border-t border-gray-100">
                <span className="text-sm text-gray-600">Crédits précédents</span>
                <span className="text-base font-semibold text-orange-600">{calculs.creditsPrecedents.toLocaleString()} GDS</span>
              </div>
            )}

            <div className="flex justify-between items-center py-2 border-t border-gray-100">
              <span className="text-sm text-gray-600">Crédit du jour</span>
              <span className="text-base font-semibold text-orange-600">{calculs.creditDuJour.toLocaleString()} GDS</span>
            </div>

            {calculs.ventesDiffereesTotal > 0 && (
              <div className="flex justify-between items-center py-2 border-t border-gray-100">
                <span className="text-sm text-gray-600">Ventes différées</span>
                <span className="text-base font-semibold text-purple-600">{calculs.ventesDiffereesTotal.toLocaleString()} GDS</span>
              </div>
            )}

            <div className="flex justify-between items-center py-3 mt-2 border-t-2 border-gray-200">
              <span className="text-base font-semibold text-gray-700">Crédit TOTAL</span>
              <span className="text-xl font-bold text-red-600">{calculs.creditTotal.toLocaleString()} GDS</span>
            </div>
          </div>
        </div>

        {/* Cash Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-8 border border-emerald-600">
          <div className="text-center">
            <p className="text-emerald-100 text-sm font-medium mb-2">Cash physique attendu</p>
            <p className="text-white text-4xl sm:text-5xl font-bold mb-1">{calculs.cashPhysique.toLocaleString()}</p>
            <p className="text-emerald-100 text-xl font-medium">GDS</p>
          </div>
        </div>
      </div>
    </div>
  );
}