import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { FiBookOpen } from 'react-icons/fi';

export default function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 12,
      }}
    >
      <FiBookOpen size={48} color="#B9843F" />
      <Typography variant="h2" fontWeight={800} className="mono" sx={{ mt: 3 }}>
        404
      </Typography>
      <Typography variant="h6" sx={{ mt: 1 }}>
        This page could not be found in the catalog.
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 4 }}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button component={Link} to="/" variant="contained">
        Back to Dashboard
      </Button>
    </Box>
  );
}
