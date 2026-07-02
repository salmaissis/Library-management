import { useCallback, useMemo, useState } from 'react';
import { Box, Button, IconButton, Stack, Tooltip } from '@mui/material';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import AuthorFormDialog from './AuthorFormDialog';
import useFetch from '../../hooks/useFetch';
import authorService from '../../services/authorService';
import { showApiError, showSuccess } from '../../utils/errorHandler';

export default function AuthorsPage() {
  const authorsFetcher = useCallback(() => authorService.getAll(), []);
  const { data: authors, loading, reload } = useFetch(authorsFetcher, []);

  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // The backend does not expose a search-by-name endpoint, so filtering
  // happens client-side against the full author list.
  const filteredRows = useMemo(() => {
    if (!authors) return [];
    if (!search) return authors;
    return authors.filter((a) =>
      a.nom.toLowerCase().includes(search.toLowerCase())
    );
  }, [authors, search]);

  const openCreate = () => {
    setEditingAuthor(null);
    setFormOpen(true);
  };

  const openEdit = (author) => {
    setEditingAuthor(author);
    setFormOpen(true);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingAuthor) {
        await authorService.update(editingAuthor.id, values);
        showSuccess('Author updated');
      } else {
        await authorService.create(values);
        showSuccess('Author added');
      }
      setFormOpen(false);
      reload();
    } catch (err) {
      showApiError(err, 'Could not save author');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await authorService.delete(deleteTarget.id);
      showSuccess('Author deleted');
      setDeleteTarget(null);
      reload();
    } catch (err) {
      showApiError(err, 'Could not delete author');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { field: 'nom', headerName: 'Name', flex: 1.2, minWidth: 180 },
    { field: 'nationalite', headerName: 'Nationality', flex: 1, minWidth: 160 },
    {
      field: 'nombreLivres',
      headerName: 'Books',
      flex: 0.6,
      minWidth: 100,
      cellClassName: 'mono',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      minWidth: 130,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => openEdit(params.row)}>
              <FiEdit2 size={16} />
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
        title="Authors"
        subtitle="Manage the authors in your library catalog."
        actions={
          <Button variant="contained" startIcon={<FiPlus />} onClick={openCreate}>
            Add Author
          </Button>
        }
      />

      <Box sx={{ mb: 2.5 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name..." />
      </Box>

      <DataTable
        rows={filteredRows}
        columns={columns}
        loading={loading}
        emptyTitle="No authors found"
        emptyDescription="Add your first author or adjust your search."
      />

      <AuthorFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingAuthor}
        submitting={submitting}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this author?"
        content={`"${deleteTarget?.nom}" and all of their books will be permanently removed.`}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </Box>
  );
}
