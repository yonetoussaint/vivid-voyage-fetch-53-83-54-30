export function OilDropIcon({ size = 12, color = "#f5c842", filled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 3C12 3 5 11 5 15.5C5 19.09 8.13 22 12 22C15.87 22 19 19.09 19 15.5C19 11 12 3 12 3Z"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {!filled && (
        <path
          d="M9 14C9 12.5 10.2 11 11.5 10.5"
          stroke={color}
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.6"
        />
      )}
    </svg>
  );
}