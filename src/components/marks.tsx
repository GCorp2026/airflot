export function Mark({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 36 36",
    width: 28,
    height: 28,
    fill: "none",
    "aria-hidden": true as const,
  };
  if (name === "Sentora") {
    return (
      <svg {...common}>
        <circle cx="18" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 28c1.5-6 5-8 10-8s8.5 2 10 8" stroke="currentColor" strokeWidth="1.6" />
        <path d="M23 16l6-3" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (name === "Polymarket") {
    return (
      <svg {...common}>
        <path d="M8 26V10l10 8 10-8v16" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (name === "BitVault") {
    return (
      <svg {...common}>
        <path d="M18 5l10 6v10l-10 6-10-6V11l10-6z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M18 15v12M8 11l10 6 10-6" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (name === "Figure") {
    return (
      <svg {...common}>
        <rect x="8" y="8" width="20" height="20" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 18h20M18 8v20" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (name === "InfiniFi") {
    return (
      <svg {...common}>
        <path d="M6 18c4-8 8-8 12 0s8 8 12 0" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (name === "Circuit") {
    return (
      <svg {...common}>
        <circle cx="10" cy="18" r="3" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="26" cy="10" r="3" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="26" cy="26" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M13 18h7M22 12l-6 4M22 24l-6-4" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="18" cy="18" r="8" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="18" cy="18" r="2" fill="currentColor" />
    </svg>
  );
}
