import { useCallback, useMemo } from 'react';
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { FiBook, FiCheckCircle, FiRepeat, FiUsers, FiClock } from 'react-icons/fi';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import StatusChip from '../components/common/StatusChip';
import useFetch from '../hooks/useFetch';
import bookService from '../services/bookService';
import authorService from '../services/authorService';
import borrowingService from '../services/borrowingService';

export default function Dashboard() {
  const booksFetcher = useCallback(() => bookService.getAll(), []);
  const authorsFetcher = useCallback(() => authorService.getAll(), []);
  const borrowingsFetcher = useCallback(() => borrowingService.getAll(), []);

  const { data: books, loading: booksLoading } = useFetch(booksFetcher, []);
  const { data: authors, loading: authorsLoading } = useFetch(authorsFetcher, []);
  const { data: borrowings, loading: borrowingsLoading } = useFetch(
    borrowingsFetcher,
    []
  );

  const stats = useMemo(() => {
    const totalBooks = books?.length ?? 0;
    const availableBooks = books?.filter((b) => b.disponible).length ?? 0;
    const borrowedBooks = totalBooks - availableBooks;
    const totalAuthors = authors?.length ?? 0;
    const totalBorrowings = borrowings?.length ?? 0;
    return { totalBooks, availableBooks, borrowedBooks, totalAuthors, totalBorrowings };
  }, [books, authors, borrowings]);

  const recentBorrowings = useMemo(() => {
    if (!borrowings) return [];
    return [...borrowings]
      .sort((a, b) => new Date(b.dateEmprunt) - new Date(a.dateEmprunt))
      .slice(0, 8);
  }, [borrowings]);

  const loading = booksLoading || authorsLoading || borrowingsLoading;

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your library's books, authors, and active borrowings."
      />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={2.4}>
          <StatCard
            label="Total Books"
            value={stats.totalBooks}
            icon={<FiBook size={22} />}
            color="primary"
            loading={booksLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <StatCard
            label="Available Books"
            value={stats.availableBooks}
            icon={<FiCheckCircle size={22} />}
            color="success"
            loading={booksLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <StatCard
            label="Borrowed Books"
            value={stats.borrowedBooks}
            icon={<FiClock size={22} />}
            color="warning"
            loading={booksLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <StatCard
            label="Authors"
            value={stats.totalAuthors}
            icon={<FiUsers size={22} />}
            color="secondary"
            loading={authorsLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <StatCard
            label="Borrowings"
            value={stats.totalBorrowings}
            icon={<FiRepeat size={22} />}
            color="info"
            loading={borrowingsLoading}
          />
        </Grid>
      </Grid>

      <Paper variant="outlined" sx={{ borderColor: 'divider' }}>
        <Box sx={{ p: 2.5, pb: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Recent Borrowings
          </Typography>
        </Box>
        {loading ? (
          <LoadingSpinner label="Loading recent borrowings..." />
        ) : recentBorrowings.length === 0 ? (
          <EmptyState
            title="No borrowings yet"
            description="Borrowings you create will show up here."
          />
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Book</TableCell>
                  <TableCell>Borrow Date</TableCell>
                  <TableCell>Expected Return</TableCell>
                  <TableCell>Actual Return</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentBorrowings.map((b) => (
                  <TableRow key={b.id} hover>
                    <TableCell>{b.livreTitre}</TableCell>
                    <TableCell className="mono">{b.dateEmprunt}</TableCell>
                    <TableCell className="mono">{b.dateRetourPrevue}</TableCell>
                    <TableCell className="mono">
                      {b.dateRetourReelle || '—'}
                    </TableCell>
                    <TableCell>
                      <StatusChip statut={b.statut} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
