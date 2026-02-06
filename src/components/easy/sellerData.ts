export const getSellerData = (vendeurActif, sellerData) => {
  if (sellerData[vendeurActif]) {
    return sellerData[vendeurActif];
  }

  const getJoinDate = () => {
    const date = new Date();
    const day = date.getDate();
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const month = months[date.getMonth()];
    const year = String(date.getFullYear()).slice(-2);
    return `${day} ${month}. ${year}`;
  };

  return {
    phone: "+212 600-000000",
    shift: "Matin (7h - 15h)",
    tardiness: 0,
    joinDate: getJoinDate(),
    email: `${vendeurActif.toLowerCase().replace(/\s+/g, '.')}@station.com`,
    location: "Casablanca, Maroc"
  };
};