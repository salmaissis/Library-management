import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { FiMenu } from 'react-icons/fi';
import { DRAWER_WIDTH } from './Sidebar';
import { useLocation } from 'react-router-dom';

const TITLES = {
  '/': 'Dashboard',
  '/books': 'Books',
  '/authors': 'Authors',
  '/borrowings': 'Borrowings',
  '/statistics': 'Statistics',
};

export default function Navbar({ onMenuClick }) {
  const location = useLocation();
  const title = TITLES[location.pathname] || 'Library Manager';

  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="inherit"
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{ display: { xs: 'inline-flex', md: 'none' } }}
          >
            <FiMenu />
          </IconButton>
          <Typography variant="h6" fontWeight={800}>
            {title}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36, fontSize: 14 }}>
          LM
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}
