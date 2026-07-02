// These values mirror the backend Java enums exactly.
// com.library.management.entity.Category
export const CATEGORIES = [
  'ROMAN',
  'SCIENCE',
  'HISTOIRE',
  'INFORMATIQUE',
  'JEUNESSE',
  'AUTRE',
];

export const CATEGORY_LABELS = {
  ROMAN: 'Roman',
  SCIENCE: 'Science',
  HISTOIRE: 'Histoire',
  INFORMATIQUE: 'Informatique',
  JEUNESSE: 'Jeunesse',
  AUTRE: 'Autre',
};

// com.library.management.entity.BorrowStatus
export const BORROW_STATUSES = ['EN_COURS', 'RETOURNE', 'EN_RETARD'];

export const BORROW_STATUS_LABELS = {
  EN_COURS: 'In Progress',
  RETOURNE: 'Returned',
  EN_RETARD: 'Late',
};

// Maps backend status -> MUI Chip color
export const BORROW_STATUS_COLORS = {
  EN_COURS: 'warning', // orange
  RETOURNE: 'success', // green
  EN_RETARD: 'error', // red
};
