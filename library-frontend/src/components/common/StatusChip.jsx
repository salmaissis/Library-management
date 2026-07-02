import { Chip } from '@mui/material';
import {
  BORROW_STATUS_COLORS,
  BORROW_STATUS_LABELS,
} from '../../utils/constants';

// statut is one of the BorrowStatus enum values: EN_COURS | RETOURNE | EN_RETARD
export default function StatusChip({ statut, size = 'small' }) {
  return (
    <Chip
      label={BORROW_STATUS_LABELS[statut] || statut}
      color={BORROW_STATUS_COLORS[statut] || 'default'}
      size={size}
      variant="filled"
    />
  );
}

export function AvailabilityChip({ disponible, size = 'small' }) {
  return (
    <Chip
      label={disponible ? 'Available' : 'Unavailable'}
      color={disponible ? 'success' : 'default'}
      size={size}
      variant={disponible ? 'filled' : 'outlined'}
    />
  );
}
