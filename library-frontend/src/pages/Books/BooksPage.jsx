import { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { AvailabilityChip } from '../../components/common/StatusChip';
import BookFormDialog from './BookFormDialog';
import useFetch from '../../hooks/useFetch';
import bookService from '../../services/bookService';
import authorService from '../../services/authorService';
import { CATEGORIES, CATEGORY_LABELS } from '../../utils/constants';
import { showApiError, showSuccess, confirmAction } from '../../utils/errorHandler';

export default function BooksPage() {
  const booksFetcher = useCallback(() => bookService.getAll(), []);
  const authorsFetcher = useCallback(() => authorService.getAll(), []);
  const { data: books, loading, reload } = useFetch(booksFetcher, []);
  const { data: authors } = useFetch(authorsFetcher, []);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [authorFilter, setAuthorFilter] = useState('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');

  const [formOpen, setFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [viewBook, setViewBook] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filteredRows = useMemo(() => {
    if (!books) return [];
    return books.filter((b) => {
      const matchesSearch =
        !search ||
        b.titre.toLowerCase().includes(search.toLowerCase()) ||
        b.isbn.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === 'ALL' || b.categorie === categoryFilter;
      const matchesAuthor =
        authorFilter === 'ALL' || String(b.auteurId) === String(authorFilter);
      const matchesAvailability =
        availabilityFilter === 'ALL' ||
        (availabilityFilter === 'AVAILABLE' && b.disponible) ||
        (availabilityFilter === 'UNAVAILABLE' && !b.disponible);
      return matchesSearch && matchesCategory && matchesAuthor && matchesAvailability;
    });
  }, [books, search, categoryFilter, authorFilter, availabilityFilter]);

  const openCreate = () => {
    setEditingBook(null);
    setFormOpen(true);
  };

  const openEdit = (book) => {
    setEditingBook(book);
    setFormOpen(true);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingBook) {
        await bookService.update(editingBook.id, values);
        showSuccess('Book updated');
      } else {
        await bookService.create(values);
        showSuccess('Book added');
      }
      setFormOpen(false);
      reload();
    } catch (err) {
      showApiError(err, 'Could not save book');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await bookService.delete(deleteTarget.id);
      showSuccess('Book deleted');
      setDeleteTarget(null);
      reload();
    } catch (err) {
      showApiError(err, 'Could not delete book');
    } finally {
      setDeleting(false);
    }
  };

  const toggleAvailability = async (book) => {
    const ok = await confirmAction({
      title: book.disponible ? 'Mark as unavailable?' : 'Mark as available?',
      text: `"${book.titre}" will be marked as ${
        book.disponible ? 'unavailable' : 'available'
      }.`,
      confirmButtonText: 'Confirm',
      icon: 'question',
    });
    if (!ok) return;
    try {
      if (book.disponible) {
        await bookService.markUnavailable(book.id);
      } else {
        await bookService.markAvailable(book.id);
      }
      showSuccess('Availability updated');
      reload();
    } catch (err) {
      showApiError(err, 'Could not update availability');
    }
  };

  const columns = [
    { field: 'titre', headerName: 'Title', flex: 1.4, minWidth: 160 },
    { field: 'isbn', headerName: 'ISBN', flex: 1, minWidth: 130, cellClassName: 'mono' },
    {
      field: 'categorie',
      headerName: 'Category',
      flex: 0.8,
      minWidth: 120,
      valueFormatter: (value) => CATEGORY_LABELS[value] || value,
    },
    {
      field: 'dateParution',
      headerName: 'Publication Date',
      flex: 0.9,
      minWidth: 140,
      cellClassName: 'mono',
    },
    { field: 'auteurNom', headerName: 'Author', flex: 1, minWidth: 140 },
    {
      field: 'disponible',
      headerName: 'Availability',
      flex: 0.8,
      minWidth: 130,
      renderCell: (params) => <AvailabilityChip disponible={params.value} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      minWidth: 220,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="View">
            <IconButton size="small" onClick={() => setViewBook(params.row)}>
              <FiEye size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => openEdit(params.row)}>
              <FiEdit2 size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title={params.row.disponible ? 'Mark unavailable' : 'Mark available'}>
            <IconButton size="small" onClick={() => toggleAvailability(params.row)}>
              {params.row.disponible ? (
                <FiXCircle size={16} />
              ) : (
                <FiCheckCircle size={16} />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => setDeleteTarget(params.row)}
            >
              <FiTrash2 size={16} />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Books"
        subtitle="Manage your library's book catalog."
        actions={
          <Button variant="contained" startIcon={<FiPlus />} onClick={openCreate}>
            Add Book
          </Button>
        }
      />

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.5}
        sx={{ mb: 2.5 }}
        flexWrap="wrap"
      >
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by title or ISBN..."
        />
        <TextField
          select
          size="small"
          label="Category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="ALL">All categories</MenuItem>
          {CATEGORIES.map((c) => (
            <MenuItem key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Author"
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="ALL">All authors</MenuItem>
          {(authors || []).map((a) => (
            <MenuItem key={a.id} value={a.id}>
              {a.nom}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Availability"
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="ALL">All</MenuItem>
          <MenuItem value="AVAILABLE">Available</MenuItem>
          <MenuItem value="UNAVAILABLE">Unavailable</MenuItem>
        </TextField>
      </Stack>

      <DataTable
        rows={filteredRows}
        columns={columns}
        loading={loading}
        emptyTitle="No books found"
        emptyDescription="Add your first book or adjust your filters."
      />

      <BookFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        authors={authors || []}
        initialData={editingBook}
        submitting={submitting}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this book?"
        content={`"${deleteTarget?.titre}" will be permanently removed.`}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        loading={deleting}
      />

      <Dialog open={!!viewBook} onClose={() => setViewBook(null)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Book Details</DialogTitle>
        <DialogContent dividers>
          {viewBook && (
            <Grid container spacing={1.5}>
              <DetailRow label="Title" value={viewBook.titre} />
              <DetailRow label="ISBN" value={viewBook.isbn} mono />
              <DetailRow
                label="Category"
                value={CATEGORY_LABELS[viewBook.categorie] || viewBook.categorie}
              />
              <DetailRow label="Publication Date" value={viewBook.dateParution} mono />
              <DetailRow label="Author" value={viewBook.auteurNom} />
              <DetailRow
                label="Availability"
                value={viewBook.disponible ? 'Available' : 'Unavailable'}
              />
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setViewBook(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function DetailRow({ label, value, mono }) {
  return (
    <Grid item xs={12}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" className={mono ? 'mono' : undefined}>
        {value}
      </Typography>
    </Grid>
  );
}
