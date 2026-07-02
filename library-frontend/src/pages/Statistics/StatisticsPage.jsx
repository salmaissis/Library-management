import { useCallback, useMemo } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import StatCard from '../../components/common/StatCard';
import useFetch from '../../hooks/useFetch';
import statisticsService from '../../services/statisticsService';
import { FiPercent, FiAlertTriangle, FiRepeat } from 'react-icons/fi';

const CHART_COLORS = ['#1E2A45', '#B9843F', '#3B6E91', '#2F9E6E', '#E08E32', '#C6483C'];

export default function StatisticsPage() {
  const monthlyFetcher = useCallback(
    () => statisticsService.getBorrowingsPerMonth(),
    []
  );
  const topAuthorsFetcher = useCallback(() => statisticsService.getTopAuthors(), []);
  const lateRateFetcher = useCallback(() => statisticsService.getLateRate(), []);

  const { data: monthly, loading: monthlyLoading } = useFetch(monthlyFetcher, []);
  const { data: topAuthors, loading: topAuthorsLoading } = useFetch(
    topAuthorsFetcher,
    []
  );
  const { data: lateRate, loading: lateRateLoading } = useFetch(lateRateFetcher, []);

  const pieData = useMemo(() => {
    if (!lateRate) return [];
    const onTime = Math.max(lateRate.totalBorrowings - lateRate.lateBorrowings, 0);
    return [
      { name: 'On time / Returned', value: onTime },
      { name: 'Late', value: lateRate.lateBorrowings },
    ];
  }, [lateRate]);

  return (
    <Box>
      <PageHeader
        title="Statistics"
        subtitle="Borrowing trends, top authors, and late-return performance."
      />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            label="Total Borrowings"
            value={lateRate?.totalBorrowings ?? 0}
            icon={<FiRepeat size={22} />}
            color="primary"
            loading={lateRateLoading}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            label="Late Borrowings"
            value={lateRate?.lateBorrowings ?? 0}
            icon={<FiAlertTriangle size={22} />}
            color="error"
            loading={lateRateLoading}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            label="Late Rate"
            value={
              lateRate ? `${lateRate.lateRate.toFixed(1)}%` : '0%'
            }
            icon={<FiPercent size={22} />}
            color="warning"
            loading={lateRateLoading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={7}>
          <Paper variant="outlined" sx={{ p: 2.5, borderColor: 'divider', height: '100%' }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Borrowings per Month
            </Typography>
            {monthlyLoading ? (
              <LoadingSpinner label="Loading chart..." />
            ) : !monthly || monthly.length === 0 ? (
              <EmptyState title="No borrowing history yet" />
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={monthly} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E0D6" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="numberOfBorrowings"
                    name="Borrowings"
                    stroke="#1E2A45"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Paper variant="outlined" sx={{ p: 2.5, borderColor: 'divider', height: '100%' }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Late Rate
            </Typography>
            {lateRateLoading ? (
              <LoadingSpinner label="Loading chart..." />
            ) : !lateRate || lateRate.totalBorrowings === 0 ? (
              <EmptyState title="No borrowings to analyze yet" />
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={index === 0 ? '#2F9E6E' : '#C6483C'}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2.5, borderColor: 'divider' }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Top Borrowed Authors
            </Typography>
            {topAuthorsLoading ? (
              <LoadingSpinner label="Loading chart..." />
            ) : !topAuthors || topAuthors.length === 0 ? (
              <EmptyState title="No borrowing history yet" />
            ) : (
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={topAuthors} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E0D6" />
                  <XAxis dataKey="authorName" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="numberOfBorrowings" name="Borrowings" radius={[6, 6, 0, 0]}>
                    {topAuthors.map((entry, index) => (
                      <Cell
                        key={entry.authorId}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
