export function Avatar({ contact, size = 32 }) {
  const initials = contact.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const hue = (contact.name.charCodeAt(0) * 37 + contact.name.charCodeAt(1 % contact.name.length) * 13) % 360;
  const bg = `hsl(${hue}, 40%, 25%)`;
  const border = `hsl(${hue}, 60%, 45%)`;

  return contact.photo
    ? <img src={contact.photo} alt={contact.name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: `2px solid ${border}`, flexShrink: 0 }} onError={e => { e.target.style.display="none"; }} />
    : <div style={{ width: size, height: size, borderRadius: "50%", background: bg, border: `2px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: size * 0.35, fontWeight: 700, color: `hsl(${hue}, 80%, 75%)`, letterSpacing: 0.5 }}>{initials}</div>;
}