import { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { FiPlus, FiTrash2, FiCornerDownLeft, FiEdit2 } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusChip from '../../components/common/StatusChip';
import BorrowingFormDialog from './BorrowingFormDialog';
import useFetch from '../../hooks/useFetch';
import borrowingService from '../../services/borrowingService';
import bookService from '../../services/bookService';
import { BORROW_STATUSES, BORROW_STATUS_LABELS } from '../../utils/constants';
import { showApiError, showSuccess, confirmAction } from '../../utils/errorHandler';

export default function BorrowingsPage() {
  const borrowingsFetcher = useCallback(() => borrowingService.getAll(), []);
  const booksFetcher = useCallback(() => bookService.getAll(), []);
  const { data: borrowings, loading, reload } = useFetch(borrowingsFetcher, []);
  const { data: books, reload: reloadBooks } = useFetch(booksFetcher, []);

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editingBorrowing, setEditingBorrowing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [returningId, setReturningId] = useState(null);

  const reloadAll = () => {
    reload();
    reloadBooks();
  };

  const filteredRows = useMemo(() => {
    if (!borrowings) return [];
    return borrowings.filter((b) => {
      const matchesStatus = statusFilter === 'ALL' || b.statut === statusFilter;
      const matchesStart = !startDate || b.dateEmprunt >= startDate;
      const matchesEnd = !endDate || b.dateEmprunt <= endDate;
      return matchesStatus && matchesStart && matchesEnd;
    });
  }, [borrowings, statusFilter, startDate, endDate]);

  const openCreate = () => {
    setEditingBorrowing(null);
    setFormOpen(true);
  };

  const openEdit = (borrowing) => {
    setEditingBorrowing(borrowing);
    setFormOpen(true);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingBorrowing) {
        await borrowingService.update(editingBorrowing.id, values);
        showSuccess('Borrowing updated');
      } else {
        await borrowingService.create(values);
        showSuccess('Borrowing created');
      }
      setFormOpen(false);
      reloadAll();
    } catch (err) {
      showApiError(err, 'Could not save borrowing');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await borrowingService.delete(deleteTarget.id);
      showSuccess('Borrowing deleted');
      setDeleteTarget(null);
      reloadAll();
    } catch (err) {
      showApiError(err, 'Could not delete borrowing');
    } finally {
      setDeleting(false);
    }
  };

  const handleReturn = async (borrowing) => {
    const ok = await confirmAction({
      title: 'Return this book?',
      text: `"${borrowing.livreTitre}" will be marked as returned today.`,
      confirmButtonText: 'Confirm Return',
      icon: 'question',
    });
    if (!ok) return;
    setReturningId(borrowing.id);
    try {
      await borrowingService.returnBook(borrowing.id);
      showSuccess('Book returned');
      reloadAll();
    } catch (err) {
      showApiError(err, 'Could not return book');
    } finally {
      setReturningId(null);
    }
  };

  const columns = [
    { field: 'livreTitre', headerName: 'Book', flex: 1.3, minWidth: 160 },
    { field: 'dateEmprunt', headerName: 'Borrow Date', flex: 0.9, minWidth: 130, cellClassName: 'mono' },
    {
      field: 'dateRetourPrevue',
      headerName: 'Expected Return',
      flex: 0.9,
      minWidth: 150,
      cellClassName: 'mono',
    },
    {
      field: 'dateRetourReelle',
      headerName: 'Actual Return',
      flex: 0.9,
      minWidth: 140,
      cellClassName: 'mono',
      valueFormatter: (value) => value || '—',
    },
    {
      field: 'statut',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 130,
      renderCell: (params) => <StatusChip statut={params.value} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      minWidth: 160,
      renderCell: (params) => {
        const isReturned = params.row.statut === 'RETOURNE';
        return (
          <Stack direction="row" spacing={0.5}>
            {!isReturned && (
              <Tooltip title="Return book">
                <IconButton
                  size="small"
                  color="success"
                  disabled={returningId === params.row.id}
                  onClick={() => handleReturn(params.row)}
                >
                  <FiCornerDownLeft size={16} />
                </IconButton>
              </Tooltip>
            )}
            {!isReturned && (
              <Tooltip title="Edit">
                <IconButton size="small" onClick={() => openEdit(params.row)}>
                  <FiEdit2 size={16} />
                </IconButton>
              </Tooltip>
            )}
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
        );
      },
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Borrowings"
        subtitle="Track active, returned, and late borrowings."
        actions={
          <Button variant="contained" startIcon={<FiPlus />} onClick={openCreate}>
            New Borrowing
          </Button>
        }
      />

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.5}
        sx={{ mb: 2.5 }}
        flexWrap="wrap"
      >
        <TextField
          select
          size="small"
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="ALL">All statuses</MenuItem>
          {BORROW_STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {BORROW_STATUS_LABELS[s]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          type="date"
          label="From"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 160 }}
        />
        <TextField
          size="small"
          type="date"
          label="To"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 160 }}
        />
      </Stack>

      <DataTable
        rows={filteredRows}
        columns={columns}
        loading={loading}
        emptyTitle="No borrowings found"
        emptyDescription="Create a borrowing or adjust your filters."
      />

      <BorrowingFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        books={books || []}
        initialData={editingBorrowing}
        submitting={submitting}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this borrowing?"
        content={`This borrowing record for "${deleteTarget?.livreTitre}" will be permanently removed.`}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </Box>
  );
}
