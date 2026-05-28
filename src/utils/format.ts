import type { AlertSeverity, AlertType } from '@/types/api'

export const ALERT_TYPE_LABEL: Record<AlertType, string> = {
  speed_violation: 'Speed violation',
  geofence_exit: 'Geofence exit',
  low_fuel: 'Low fuel',
  offline: 'Offline',
}

// Tailwind text/border/background classes per severity for alert UI.
export const SEVERITY_CLASS: Record<
  AlertSeverity,
  { text: string; dot: string; border: string }
> = {
  high: { text: 'text-red-400', dot: 'bg-red-500', border: 'border-l-red-500' },
  medium: {
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    border: 'border-l-amber-400',
  },
  low: { text: 'text-sky-400', dot: 'bg-sky-400', border: 'border-l-sky-400' },
}

// Maps an alert severity to a PrimeVue Toast severity.
export const TOAST_SEVERITY: Record<
  AlertSeverity,
  'error' | 'warn' | 'info'
> = {
  high: 'error',
  medium: 'warn',
  low: 'info',
}
