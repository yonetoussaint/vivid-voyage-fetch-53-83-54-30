// src/components/PrivacyPolicy.js
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Politique de Confidentialité - Mima</h1>
      <p><strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString()}</p>
      
      <h2>1. Informations que nous collectons</h2>
      <p>Nous collectons votre adresse email et les informations de profil nécessaires pour vous connecter via Google OAuth.</p>
      
      <h2>2. Utilisation des informations</h2>
      <p>Vos informations sont utilisées uniquement pour :</p>
      <ul>
        <li>Vous connecter à votre compte</li>
        <li>Personnaliser votre expérience</li>
        <li>Vous envoyer des notifications importantes</li>
      </ul>
      
      <h2>3. Contact</h2>
      <p>Pour toute question sur cette politique, contactez-nous à : <strong>support@mimaht.com</strong></p>
    </div>
  );
};

export default PrivacyPolicy;