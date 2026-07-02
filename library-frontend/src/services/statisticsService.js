import axiosInstance from './axiosInstance';

// Mirrors com.library.management.controller.StatisticsController
// Base path: /api/statistics
const statisticsService = {
  // Returns MonthlyBorrowingDTO[]: { month: "YYYY-MM", numberOfBorrowings }
  getBorrowingsPerMonth: () =>
    axiosInstance
      .get('/statistics/borrowings-per-month')
      .then((res) => res.data),

  // Returns TopAuthorDTO[]: { authorId, authorName, numberOfBorrowings }
  getTopAuthors: () =>
    axiosInstance.get('/statistics/top-authors').then((res) => res.data),

  // Returns LateRateDTO: { totalBorrowings, lateBorrowings, lateRate }
  getLateRate: () =>
    axiosInstance.get('/statistics/late-rate').then((res) => res.data),
};

export default statisticsService;
