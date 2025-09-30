
import { authTranslations } from './auth';

// Helper function to merge translations
const mergeTranslations = (base: any, auth: any) => {
  return {
    ...base,
    ...auth
  };
};

export const translations = {
  ht: mergeTranslations({
    // Header translations
    header: {
      language: "Lang",
      location: "Kote",
      selectLanguage: "Chwazi Lang",
      selectLocation: "Chwazi Kote w ye"
    },
    
    // Home page translations  
    home: {
      forYou: "Pou Ou",
      posts: "Pòs yo",
      messages: "Mesaj yo", 
      trending: "Avan-gad",
      videos: "Videyo yo"
    },

    // Product translations
    product: {
      addToCart: "Mete nan Kach"
    },

    // Mobile translations
    mobile: {
      welcomeTo: "Byenvini nan",
      globalTransfer: "Global Transfer",
      verifiedAccount: "Kont Verifye",
      memberSince: "Manm depi",
      verified: "Verifye",
      idConfirmed: "ID Konfime",
      sendMoney: "Voye Lajan",
      viewProfile: "Gade Pwofil",
      todaysRate: "To Jodi a",
      live: "Live",
      quickTransfer: "Transfè Rapid",
      sendToHaiti: "Voye nan Ayiti",
      localTransfer: "Transfè Lokal",
      expressSend: "Voye Rapid",
      billPayment: "Peye Fakti",
      financialServices: "Sèvis Finansye",
      transferHistory: "Istwa Transfè",
      recipients: "Moun ki Resevwa yo",
      trackMoney: "Swiv Lajan",
      mobileTopUp: "Rechaj Telefòn",
      addFunds: "Ajoute Lajan",
      agentLocator: "Jwenn Ajan",
      rateCalculator: "Kalkilatè To",
      recentRecipients: "Moun ki Resevwa Dènyèman",
      last: "Dènye",
      send: "Voye",
      daysAgo: "{{days}} jou pase",
      weekAgo: "1 semèn pase",
      weeksAgo: "{{weeks}} semèn pase",
      videoTutorials: "Videyo Eksplikasyon",
      viewAll: "Gade Tout",
      howToSendMoney: "Kijan pou Voye Lajan nan Ayiti",
      stepByStepGuide: "Gid etap pa etap pou nouvo itilizatè yo",
      views: "moun ki gade",
      cashPickupLocations: "Kote pou Pran Lajan",
      findNearestPickup: "Jwenn kote ki pi pre a",
      mobileMoney: "Lajan Mobil ak Peye Fakti",
      payBillsAndTopUp: "Peye fakti ak rechaj telefòn nan Ayiti",
      zeroFeesOffer: "Pa gen Frè Mwa sa a!",
      zeroFeesDescription: "Voye jiska $500 san frè transfè",
      validUntil: "Valid jiska 30 Jen 2025",
      useOffer: "Itilize Òf la",
      termsApply: "Kondisyon yo aplike"
    }
  }, authTranslations.ht),
  
  en: mergeTranslations({
    // Header translations
    header: {
      language: "Language",
      location: "Location", 
      selectLanguage: "Select Language",
      selectLocation: "Select Your Location"
    },
    
    // Home page translations
    home: {
      forYou: "For You",
      posts: "Posts",
      messages: "Messages",
      trending: "Trending", 
      videos: "Videos"
    },

    // Product translations
    product: {
      addToCart: "Add to Cart"
    },

    // Mobile translations
    mobile: {
      welcomeTo: "Welcome to",
      globalTransfer: "Global Transfer",
      verifiedAccount: "Verified Account",
      memberSince: "Member since",
      verified: "Verified",
      idConfirmed: "ID Confirmed",
      sendMoney: "Send Money",
      viewProfile: "View Profile",
      todaysRate: "Today's Rate",
      live: "Live",
      quickTransfer: "Quick Transfer",
      sendToHaiti: "Send to Haiti",
      localTransfer: "Local Transfer",
      expressSend: "Express Send",
      billPayment: "Bill Payment",
      financialServices: "Financial Services",
      transferHistory: "Transfer History",
      recipients: "Recipients",
      trackMoney: "Track Money",
      mobileTopUp: "Mobile Top-Up",
      addFunds: "Add Funds",
      agentLocator: "Agent Locator",
      rateCalculator: "Rate Calculator",
      recentRecipients: "Recent Recipients",
      last: "Last",
      send: "Send",
      daysAgo: "{{days}} days ago",
      weekAgo: "1 week ago",
      weeksAgo: "{{weeks}} weeks ago",
      videoTutorials: "Video Tutorials",
      viewAll: "View All",
      howToSendMoney: "How to Send Money to Haiti",
      stepByStepGuide: "Step-by-step guide for first-time users",
      views: "views",
      cashPickupLocations: "Cash Pickup Locations",
      findNearestPickup: "Find the nearest pickup point",
      mobileMoney: "Mobile Money & Bill Payments",
      payBillsAndTopUp: "Pay bills and top-up phones in Haiti",
      zeroFeesOffer: "Zero Fees This Month!",
      zeroFeesDescription: "Send up to $500 with no transfer fees",
      validUntil: "Valid until June 30, 2025",
      useOffer: "Use Offer",
      termsApply: "Terms apply"
    }
  }, authTranslations.en),

  es: mergeTranslations({
    // Header translations
    header: {
      language: "Idioma",
      location: "Ubicación",
      selectLanguage: "Seleccionar Idioma", 
      selectLocation: "Seleccionar Tu Ubicación"
    },
    
    // Home page translations
    home: {
      forYou: "Para Ti",
      posts: "Publicaciones",
      messages: "Mensajes",
      trending: "Tendencias",
      videos: "Videos"
    },

    // Product translations
    product: {
      addToCart: "Añadir al Carrito"
    },

    // Mobile translations
    mobile: {
      welcomeTo: "Bienvenido a",
      globalTransfer: "Global Transfer",
      verifiedAccount: "Cuenta Verificada",
      memberSince: "Miembro desde",
      verified: "Verificado",
      idConfirmed: "ID Confirmado",
      sendMoney: "Enviar Dinero",
      viewProfile: "Ver Perfil",
      todaysRate: "Tasa de Hoy",
      live: "En Vivo",
      quickTransfer: "Transferencia Rápida",
      sendToHaiti: "Enviar a Haití",
      localTransfer: "Transferencia Local",
      expressSend: "Envío Express",
      billPayment: "Pago de Facturas",
      financialServices: "Servicios Financieros",
      transferHistory: "Historial de Transferencias",
      recipients: "Destinatarios",
      trackMoney: "Rastrear Dinero",
      mobileTopUp: "Recarga Móvil",
      addFunds: "Agregar Fondos",
      agentLocator: "Localizador de Agentes",
      rateCalculator: "Calculadora de Tasas",
      recentRecipients: "Destinatarios Recientes",
      last: "Último",
      send: "Enviar",
      daysAgo: "hace {{days}} días",
      weekAgo: "hace 1 semana",
      weeksAgo: "hace {{weeks}} semanas",
      videoTutorials: "Tutoriales en Video",
      viewAll: "Ver Todo",
      howToSendMoney: "Cómo Enviar Dinero a Haití",
      stepByStepGuide: "Guía paso a paso para usuarios primerizos",
      views: "visualizaciones",
      cashPickupLocations: "Ubicaciones de Recogida de Efectivo",
      findNearestPickup: "Encuentra el punto de recogida más cercano",
      mobileMoney: "Dinero Móvil y Pago de Facturas",
      payBillsAndTopUp: "Paga facturas y recarga teléfonos en Haití",
      zeroFeesOffer: "¡Sin Comisiones Este Mes!",
      zeroFeesDescription: "Envía hasta $500 sin comisiones de transferencia",
      validUntil: "Válido hasta el 30 de junio de 2025",
      useOffer: "Usar Oferta",
      termsApply: "Se aplican términos"
    }
  }, authTranslations.es),

  fr: mergeTranslations({
    // Header translations
    header: {
      language: "Langue",
      location: "Localisation",
      selectLanguage: "Sélectionner la Langue",
      selectLocation: "Sélectionner Votre Localisation"
    },
    
    // Home page translations
    home: {
      forYou: "Pour Vous",
      posts: "Publications", 
      messages: "Messages",
      trending: "Tendances",
      videos: "Vidéos"
    },

    // Product translations
    product: {
      addToCart: "Ajouter au Panier"
    },

    // Mobile translations
    mobile: {
      welcomeTo: "Bienvenue à",
      globalTransfer: "Global Transfer",
      verifiedAccount: "Compte Vérifié",
      memberSince: "Membre depuis",
      verified: "Vérifié",
      idConfirmed: "ID Confirmé",
      sendMoney: "Envoyer de l'Argent",
      viewProfile: "Voir le Profil",
      todaysRate: "Taux d'Aujourd'hui",
      live: "En Direct",
      quickTransfer: "Transfert Rapide",
      sendToHaiti: "Envoyer en Haïti",
      localTransfer: "Transfert Local",
      expressSend: "Envoi Express",
      billPayment: "Paiement de Factures",
      financialServices: "Services Financiers",
      transferHistory: "Historique des Transferts",
      recipients: "Destinataires",
      trackMoney: "Suivre l'Argent",
      mobileTopUp: "Recharge Mobile",
      addFunds: "Ajouter des Fonds",
      agentLocator: "Localisateur d'Agents",
      rateCalculator: "Calculateur de Taux",
      recentRecipients: "Destinataires Récents",
      last: "Dernier",
      send: "Envoyer",
      daysAgo: "il y a {{days}} jours",
      weekAgo: "il y a 1 semaine",
      weeksAgo: "il y a {{weeks}} semaines",
      videoTutorials: "Tutoriels Vidéo",
      viewAll: "Voir Tout",
      howToSendMoney: "Comment Envoyer de l'Argent en Haïti",
      stepByStepGuide: "Guide étape par étape pour les nouveaux utilisateurs",
      views: "vues",
      cashPickupLocations: "Points de Ret rait d'Espèces",
      findNearestPickup: "Trouvez le point de retrait le plus proche",
      mobileMoney: "Argent Mobile et Paiement de Factures",
      payBillsAndTopUp: "Payez les factures et rechargez les téléphones en Haïti",
      zeroFeesOffer: "Aucuns Frais Ce Mois-ci !",
      zeroFeesDescription: "Envoyez jusqu'à 500 $ sans frais de transfert",
      validUntil: "Valide jusqu'au 30 juin 2025",
      useOffer: "Utiliser l'Offre",
      termsApply: "Conditions applicables"
    }
  }, authTranslations.fr)
};
