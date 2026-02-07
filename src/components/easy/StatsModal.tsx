import React, { useMemo } from 'react';
import { X, BarChart, TrendingUp, DollarSign, Calendar, PieChart, Users } from 'lucide-react';

const StatsModal = ({ shorts, vendeurActif, onClose }) => {
  const statistics = useMemo(() => {
    if (shorts.length === 0) {
      return {
        totalShorts: 0,
        totalAmount: 0,
        averageShort: 0,
        byShift: {},
        byStatus: {},
        recentShorts: [],
        monthlyTrend: []
      };
    }

    const totalAmount = shorts.reduce((sum, short) => sum + short.shortAmount, 0);
    const averageShort = totalAmount / shorts.length;

    // Group by shift
    const byShift = shorts.reduce((acc, short) => {
      acc[short.shift] = (acc[short.shift] || 0) + 1;
      return acc;
    }, {});

    // Group by status
    const byStatus = shorts.reduce((acc, short) => {
      acc[short.status] = (acc[short.status] || 0) + 1;
      return acc;
    }, {});

    // Monthly trend (simplified)
    const monthlyTrend = shorts
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);

    return {
      totalShorts: shorts.length,
      totalAmount,
      averageShort,
      byShift,
      byStatus,
      recentShorts: shorts.slice(0, 5),
      monthlyTrend
    };
  }, [shorts]);

  const formatNumber = (num) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart className="w-5 h-5 text-black" />
            <h3 className="text-lg font-bold text-black">Statistiques des Déficits</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-blue-600 font-medium">Total Déficits</span>
                <BarChart className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-lg font-bold text-blue-700">{statistics.totalShorts}</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-red-600 font-medium">Montant Total</span>
                <DollarSign className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-lg font-bold text-red-700">{formatNumber(statistics.totalAmount)}</p>
              <p className="text-xs text-red-600 mt-0.5">HTG</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-green-600 font-medium">Moyenne</span>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-lg font-bold text-green-700">{formatNumber(statistics.averageShort)}</p>
              <p className="text-xs text-green-600 mt-0.5">HTG/déficit</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-purple-600 font-medium">Vendeur</span>
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-lg font-bold text-purple-700">{vendeurActif?.nom || 'N/A'}</p>
            </div>
          </div>

          {/* Distribution by Shift */}
          <div className="space-y-3">
            <h4 className="font-bold text-black flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Distribution par Quart
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(statistics.byShift).map(([shift, count]) => (
                <div key={shift} className="bg-gray-50 rounded-lg p-3">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">{shift}</p>
                    <p className="text-lg font-bold text-black">{count}</p>
                    <p className="text-xs text-gray-500">
                      {((count / statistics.totalShorts) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Distribution */}
          <div className="space-y-3">
            <h4 className="font-bold text-black flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Distribution par Statut
            </h4>
            <div className="space-y-2">
              {Object.entries(statistics.byStatus).map(([status, count]) => {
                const percentage = (count / statistics.totalShorts) * 100;
                let colorClass = '';
                switch (status) {
                  case 'pending': colorClass = 'bg-yellow-500'; break;
                  case 'overdue': colorClass = 'bg-red-500'; break;
                  case 'paid': colorClass = 'bg-green-500'; break;
                  default: colorClass = 'bg-gray-500';
                }

                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
                      <span className="text-sm text-gray-700 capitalize">
                        {status === 'pending' ? 'En attente' : 
                         status === 'overdue' ? 'En retard' : 
                         status === 'paid' ? 'Payés' : status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${colorClass}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-black">
                        {count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Deficits */}
          {statistics.recentShorts.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-black">Déficits Récents</h4>
              <div className="space-y-2">
                {statistics.recentShorts.map((short) => (
                  <div key={short.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-black">{short.date}</p>
                      <p className="text-xs text-gray-500">{short.shift} • {short.notes}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600">{formatNumber(short.shortAmount)} HTG</p>
                      <p className="text-xs text-gray-500 capitalize">{short.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;