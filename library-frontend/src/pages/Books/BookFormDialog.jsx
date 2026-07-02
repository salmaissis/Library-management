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
  FormControlLabel,
  Grid,
  MenuItem,
  Switch,
  TextField,
} from '@mui/material';
import { CATEGORIES, CATEGORY_LABELS } from '../../utils/constants';

const todayIso = () => new Date().toISOString().slice(0, 10);

// Mirrors BookRequestDTO validation on the backend:
// titre @NotBlank, isbn @NotBlank, categorie @NotNull,
// dateParution @NotNull @PastOrPresent, auteurId @NotNull
const schema = yup.object({
  titre: yup.string().trim().required('Title is required'),
  isbn: yup.string().trim().required('ISBN is required'),
  categorie: yup
    .string()
    .oneOf(CATEGORIES, 'Category is required')
    .required('Category is required'),
  dateParution: yup
    .string()
    .required('Publication date is required')
    .test(
      'not-in-future',
      'Publication date cannot be in the future',
      (value) => !value || value <= todayIso()
    ),
  auteurId: yup
    .number()
    .typeError('Author is required')
    .required('Author is required'),
  disponible: yup.boolean(),
});

const defaultValues = {
  titre: '',
  isbn: '',
  categorie: '',
  dateParution: '',
  auteurId: '',
  disponible: true,
};

export default function BookFormDialog({
  open,
  onClose,
  onSubmit,
  authors = [],
  initialData,
  submitting,
}) {
  const isEdit = Boolean(initialData);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      reset(
        initialData
          ? {
              titre: initialData.titre || '',
              isbn: initialData.isbn || '',
              categorie: initialData.categorie || '',
              dateParution: initialData.dateParution || '',
              auteurId: initialData.auteurId ?? '',
              disponible: initialData.disponible ?? true,
            }
          : defaultValues
      );
    }
  }, [open, initialData, reset]);

  const submit = (values) => {
    onSubmit({
      ...values,
      auteurId: Number(values.auteurId),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={700}>
        {isEdit ? 'Edit Book' : 'Add Book'}
      </DialogTitle>
      <form onSubmit={handleSubmit(submit)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="titre"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Title"
                    fullWidth
                    error={!!errors.titre}
                    helperText={errors.titre?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="isbn"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ISBN"
                    fullWidth
                    error={!!errors.isbn}
                    helperText={errors.isbn?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="categorie"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Category"
                    fullWidth
                    error={!!errors.categorie}
                    helperText={errors.categorie?.message}
                  >
                    {CATEGORIES.map((c) => (
                      <MenuItem key={c} value={c}>
                        {CATEGORY_LABELS[c]}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="dateParution"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    label="Publication Date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dateParution}
                    helperText={errors.dateParution?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="auteurId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Author"
                    fullWidth
                    error={!!errors.auteurId}
                    helperText={errors.auteurId?.message}
                  >
                    {authors.map((a) => (
                      <MenuItem key={a.id} value={a.id}>
                        {a.nom}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="disponible"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Available"
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
            {isEdit ? 'Save Changes' : 'Add Book'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
