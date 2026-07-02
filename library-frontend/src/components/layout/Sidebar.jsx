import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiBook,
  FiUsers,
  FiRepeat,
  FiBarChart2,
} from 'react-icons/fi';

export const DRAWER_WIDTH = 240;

const navItems = [
  { label: 'Dashboard', to: '/', icon: <FiGrid size={19} /> },
  { label: 'Books', to: '/books', icon: <FiBook size={19} /> },
  { label: 'Authors', to: '/authors', icon: <FiUsers size={19} /> },
  { label: 'Borrowings', to: '/borrowings', icon: <FiRepeat size={19} /> },
  { label: 'Statistics', to: '/statistics', icon: <FiBarChart2 size={19} /> },
];

function SidebarContent() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ px: 3 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 1.5,
            bgcolor: 'secondary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 1.5,
            flexShrink: 0,
          }}
        >
          <FiBook color="#fff" size={18} />
        </Box>
        <Typography variant="subtitle1" fontWeight={800} color="common.white" noWrap>
          Library Manager
        </Typography>
      </Toolbar>
      <List sx={{ px: 1.5, mt: 1, flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            end={item.to === '/'}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              color: 'rgba(255,255,255,0.75)',
              '&.active': {
                bgcolor: 'rgba(255,255,255,0.08)',
                color: '#fff',
                '& .MuiListItemIcon-root': { color: 'secondary.light' },
              },
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.06)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
            />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ p: 2.5 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)' }}>
          Library Management System v1.0
        </Typography>
      </Box>
    </Box>
  );
}

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            bgcolor: 'primary.main',
          },
        }}
      >
        <SidebarContent />
      </Drawer>
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: 'primary.main',
            border: 'none',
          },
        }}
        open
      >
        <SidebarContent />
      </Drawer>
    </Box>
  );
}
