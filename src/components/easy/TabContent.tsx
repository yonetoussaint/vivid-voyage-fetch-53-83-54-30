import React from 'react';
import RetardsTab from './RetardsTab';
import VentesTab from './VentesTab';
import MetersTab from './MetersTab';
import ShortsTab from './ShortsTab';

const TabContent = ({ activeTab, vendeurActif, currentSeller, affectations }) => {
  switch (activeTab) {
    case 'retards':
      return (
        <RetardsTab 
          vendeurActif={vendeurActif}
          currentSeller={currentSeller}
          affectations={affectations}
        />
      );
    
    case 'ventes':
      return <VentesTab />;
    
    case 'meters':
      return <MetersTab />;
    
    case 'shorts':
      return <ShortsTab vendeurActif={vendeurActif} />;
    
    default:
      return null;
  }
};

export default TabContent;