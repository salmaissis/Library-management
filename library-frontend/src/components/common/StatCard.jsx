import { Card, CardContent, Box, Typography, Skeleton } from '@mui/material';

export default function StatCard({ label, value, icon, color = 'primary', loading }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}
          >
            {label}
          </Typography>
          {loading ? (
            <Skeleton width={64} height={40} />
          ) : (
            <Typography variant="h4" fontWeight={800} className="mono" sx={{ mt: 0.25 }}>
              {value}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${color}.main`,
            color: `${color}.contrastText`,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      </CardContent>
    </Card>
  );
}
