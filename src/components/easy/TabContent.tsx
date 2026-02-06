import React from 'react';
import RetardsTab from './tabs/RetardsTab';
import VentesTab from './tabs/VentesTab';
import MetersTab from './tabs/MetersTab';
import ShortsTab from './tabs/ShortsTab';

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