import { Box, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

/**
 * Thin wrapper around MUI's DataGrid that standardizes loading / empty
 * states, pagination, and styling across the Books / Authors / Borrowings
 * pages.
 */
export default function DataTable({
  rows,
  columns,
  loading,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your filters or add a new record.',
  pageSizeOptions = [5, 10, 25],
  initialPageSize = 10,
  height = 560,
}) {
  if (!loading && (!rows || rows.length === 0)) {
    return (
      <Paper variant="outlined" sx={{ borderColor: 'divider' }}>
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ borderColor: 'divider', overflow: 'hidden' }}>
      <Box sx={{ height, width: '100%' }}>
        <DataGrid
          rows={rows || []}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: initialPageSize } },
          }}
          pageSizeOptions={pageSizeOptions}
          slots={{
            loadingOverlay: () => <LoadingSpinner label="Loading records..." />,
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: 'background.default',
            },
          }}
        />
      </Box>
    </Paper>
  );
}
