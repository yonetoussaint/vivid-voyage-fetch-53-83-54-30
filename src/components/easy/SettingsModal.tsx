import React, { useState } from 'react';
import { X, Save, Lock, DollarSign, Calendar, Printer, Bell } from 'lucide-react';

const SettingsModal = ({ appSettings, onClose, onSave }) => {
  const [settings, setSettings] = useState(appSettings);
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '']);
  const [showPinFields, setShowPinFields] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSave = () => {
    const newErrors = {};
    
    if (showPinFields) {
      const enteredPin = pin.join('');
      const enteredConfirmPin = confirmPin.join('');
      
      if (enteredPin.length !== 4) {
        newErrors.pin = 'Le PIN doit avoir 4 chiffres';
      }
      if (enteredConfirmPin.length !== 3) {
        newErrors.confirmPin = 'Le code de confirmation doit avoir 3 chiffres';
      }
      if (enteredPin !== enteredConfirmPin + '1') {
        newErrors.match = 'Les codes ne correspondent pas';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (showPinFields) {
      onSave({ ...settings, managerPin: pin.join('') });
    } else {
      onSave(settings);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-black">Paramètres</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Manager PIN Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-700" />
              <h4 className="font-bold text-black">Code PIN Gérant</h4>
            </div>
            
            <button
              onClick={() => setShowPinFields(!showPinFields)}
              className="w-full py-2 border border-gray-300 rounded-lg text-sm font-medium"
            >
              {showPinFields ? 'Annuler changement' : 'Changer le code PIN'}
            </button>

            {showPinFields && (
              <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau code PIN (4 chiffres)
                  </label>
                  <div className="flex justify-center gap-2">
                    {[0, 1, 2, 3].map((index) => (
                      <input
                        key={index}
                        type="password"
                        maxLength={1}
                        value={pin[index] || ''}
                        onChange={(e) => {
                          const newPin = [...pin];
                          newPin[index] = e.target.value;
                          setPin(newPin);
                        }}
                        className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg"
                      />
                    ))}
                  </div>
                  {errors.pin && <p className="text-red-500 text-xs mt-1">{errors.pin}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer (3 derniers chiffres + 1)
                  </label>
                  <div className="flex justify-center gap-2">
                    {[0, 1, 2].map((index) => (
                      <input
                        key={index}
                        type="password"
                        maxLength={1}
                        value={confirmPin[index] || ''}
                        onChange={(e) => {
                          const newConfirmPin = [...confirmPin];
                          newConfirmPin[index] = e.target.value;
                          setConfirmPin(newConfirmPin);
                        }}
                        className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg"
                      />
                    ))}
                    <div className="w-12 h-12 flex items-center justify-center text-xl font-bold">
                      1
                    </div>
                  </div>
                  {errors.confirmPin && <p className="text-red-500 text-xs mt-1">{errors.confirmPin}</p>}
                  {errors.match && <p className="text-red-500 text-xs mt-1">{errors.match}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Salary Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-gray-700" />
              <h4 className="font-bold text-black">Paramètres Salaire</h4>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salaire mensuel (HTG)
              </label>
              <input
                type="number"
                step="0.001"
                value={settings.monthlySalary}
                onChange={(e) => setSettings({...settings, monthlySalary: parseFloat(e.target.value)})}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Due Date Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-700" />
              <h4 className="font-bold text-black">Dates limites</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jours pour paiement
                </label>
                <input
                  type="number"
                  value={settings.dueDateDays}
                  onChange={(e) => setSettings({...settings, dueDateDays: parseInt(e.target.value)})}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  min="1"
                  max="30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jours avant déduction
                </label>
                <input
                  type="number"
                  value={settings.autoDeductionDays}
                  onChange={(e) => setSettings({...settings, autoDeductionDays: parseInt(e.target.value)})}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  min="1"
                  max="30"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-700" />
              <h4 className="font-bold text-black">Notifications</h4>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.notifications?.dueDateReminder || false}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      dueDateReminder: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Rappel date limite</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.notifications?.overdueAlert || false}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      overdueAlert: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Alerte retard</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.notifications?.dailySummary || false}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      dailySummary: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Résumé quotidien</span>
              </label>
            </div>
          </div>

          {/* Printer Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Printer className="w-5 h-5 text-gray-700" />
              <h4 className="font-bold text-black">Imprimante</h4>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'imprimante
              </label>
              <input
                type="text"
                value={settings.receiptPrinterSettings?.name || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  receiptPrinterSettings: {
                    ...settings.receiptPrinterSettings,
                    name: e.target.value
                  }
                })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Nom de l'imprimante par défaut"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 bg-black text-white rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;