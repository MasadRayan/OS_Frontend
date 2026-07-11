// Tailwind's JIT compiler needs complete, literal class strings — dynamic
// interpolation like `bg-sev-${n}` won't be detected. These lookup maps are
// the sanctioned way to apply severity-based color coding with Tailwind.

export const SEVERITY_LABELS = {
  1: 'Critical',
  2: 'Serious',
  3: 'Moderate',
  4: 'Minor',
  5: 'Non-urgent',
};

export const SEVERITY_LIST = [1, 2, 3, 4, 5];

export const SEV_DOT_BG = {
  1: 'bg-red-500',
  2: 'bg-orange-500',
  3: 'bg-yellow-500',
  4: 'bg-green-500',
  5: 'bg-blue-500',
};

export const SEV_TEXT = {
  1: 'text-red-500',
  2: 'text-orange-500',
  3: 'text-yellow-500',
  4: 'text-green-500',
  5: 'text-blue-500',
};

export const SEV_BORDER = {
  1: 'border-red-500',
  2: 'border-orange-500',
  3: 'border-yellow-500',
  4: 'border-green-500',
  5: 'border-blue-500',
};

export const SEV_BADGE = {
  1: 'bg-red-500/10 text-red-600 dark:text-red-400',
  2: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  3: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  4: 'bg-green-500/10 text-green-600 dark:text-green-400',
  5: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
};

// Hex values for contexts that need a literal color (SVG/recharts fill props).
export const SEV_HEX = {
  1: '#ef4444',
  2: '#f97316',
  3: '#eab308',
  4: '#22c55e',
  5: '#3b82f6',
};
