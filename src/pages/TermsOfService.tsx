// src/components/TermsOfService.js
import React from 'react';

const TermsOfService = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Conditions d'Utilisation - Mima</h1>
      <p><strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString()}</p>
      
      <h2>1. Acceptation des conditions</h2>
      <p>En utilisant Mima, vous acceptez ces conditions d'utilisation.</p>
      
      <h2>2. Compte utilisateur</h2>
      <p>Vous êtes responsable de la sécurité de votre compte et de vos informations de connexion.</p>
      
      <h2>3. Contact</h2>
      <p>Questions ? Contactez-nous à : <strong>support@mimaht.com</strong></p>
    </div>
  );
};

export default TermsOfService;