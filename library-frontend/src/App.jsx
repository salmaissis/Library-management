import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import BooksPage from './pages/Books/BooksPage';
import AuthorsPage from './pages/Authors/AuthorsPage';
import BorrowingsPage from './pages/Borrowings/BorrowingsPage';
import StatisticsPage from './pages/Statistics/StatisticsPage';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="authors" element={<AuthorsPage />} />
        <Route path="borrowings" element={<BorrowingsPage />} />
        <Route path="statistics" element={<StatisticsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
