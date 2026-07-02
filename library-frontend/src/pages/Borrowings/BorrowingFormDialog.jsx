import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';

// Mirrors BorrowingRequestDTO validation on the backend:
// livreId @NotNull, dateEmprunt @NotNull, dateRetourPrevue @NotNull and
// strictly after dateEmprunt (@AssertTrue on isDateRetourPrevueValide()).
const schema = yup.object({
  livreId: yup
    .number()
    .typeError('Book is required')
    .required('Book is required'),
  dateEmprunt: yup.string().required('Borrow date is required'),
  dateRetourPrevue: yup
    .string()
    .required('Expected return date is required')
    .test(
      'after-borrow-date',
      'Expected return date must be after the borrow date',
      function (value) {
        const { dateEmprunt } = this.parent;
        if (!value || !dateEmprunt) return true;
        return value > dateEmprunt;
      }
    ),
});

const defaultValues = {
  livreId: '',
  dateEmprunt: new Date().toISOString().slice(0, 10),
  dateRetourPrevue: '',
};

export default function BorrowingFormDialog({
  open,
  onClose,
  onSubmit,
  books = [],
  initialData,
  submitting,
}) {
  const isEdit = Boolean(initialData);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema), defaultValues });

  useEffect(() => {
    if (open) {
      reset(
        initialData
          ? {
              livreId: initialData.livreId ?? '',
              dateEmprunt: initialData.dateEmprunt || '',
              dateRetourPrevue: initialData.dateRetourPrevue || '',
            }
          : defaultValues
      );
    }
  }, [open, initialData, reset]);

  // Only available books can be borrowed, except the book already tied to
  // the borrowing being edited (it stays selectable so the user can keep it).
  const selectableBooks = useMemo(() => {
    return books.filter(
      (b) => b.disponible || b.id === initialData?.livreId
    );
  }, [books, initialData]);

  const submit = (values) => {
    onSubmit({ ...values, livreId: Number(values.livreId) });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight={700}>
        {isEdit ? 'Edit Borrowing' : 'New Borrowing'}
      </DialogTitle>
      <form onSubmit={handleSubmit(submit)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="livreId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Book"
                    fullWidth
                    error={!!errors.livreId}
                    helperText={errors.livreId?.message}
                  >
                    {selectableBooks.length === 0 && (
                      <MenuItem value="" disabled>
                        No available books
                      </MenuItem>
                    )}
                    {selectableBooks.map((b) => (
                      <MenuItem key={b.id} value={b.id}>
                        {b.titre}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="dateEmprunt"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    label="Borrow Date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dateEmprunt}
                    helperText={errors.dateEmprunt?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="dateRetourPrevue"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    label="Expected Return"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dateRetourPrevue}
                    helperText={errors.dateRetourPrevue?.message}
                  />
                )}
              />
            </Grid>
            {selectableBooks.length === 0 && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  All books are currently borrowed. Mark a book as available
                  or return an existing borrowing first.
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || selectableBooks.length === 0}
          >
            {isEdit ? 'Save Changes' : 'Create Borrowing'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
