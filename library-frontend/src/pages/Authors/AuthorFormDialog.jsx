import { useEffect } from 'react';
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
  TextField,
} from '@mui/material';

// Mirrors AuthorRequestDTO validation on the backend: nom @NotBlank
const schema = yup.object({
  nom: yup.string().trim().required('Name is required'),
  nationalite: yup.string().trim().nullable(),
});

const defaultValues = { nom: '', nationalite: '' };

export default function AuthorFormDialog({
  open,
  onClose,
  onSubmit,
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
              nom: initialData.nom || '',
              nationalite: initialData.nationalite || '',
            }
          : defaultValues
      );
    }
  }, [open, initialData, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight={700}>
        {isEdit ? 'Edit Author' : 'Add Author'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="nom"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    fullWidth
                    error={!!errors.nom}
                    helperText={errors.nom?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="nationalite"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nationality"
                    fullWidth
                    error={!!errors.nationalite}
                    helperText={errors.nationalite?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {isEdit ? 'Save Changes' : 'Add Author'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
