import axiosInstance from './axiosInstance';

// Mirrors com.library.management.controller.BorrowingController
// Base path: /api/borrowings
const borrowingService = {
  getAll: () => axiosInstance.get('/borrowings').then((res) => res.data),

  getById: (id) =>
    axiosInstance.get(`/borrowings/${id}`).then((res) => res.data),

  // requestBody matches BorrowingRequestDTO:
  // { livreId, dateEmprunt, dateRetourPrevue }
  // (dateRetourPrevue must be strictly after dateEmprunt - validated both
  // client-side with Yup and server-side with @AssertTrue)
  create: (borrowingRequestDTO) =>
    axiosInstance
      .post('/borrowings', borrowingRequestDTO)
      .then((res) => res.data),

  update: (id, borrowingRequestDTO) =>
    axiosInstance
      .put(`/borrowings/${id}`, borrowingRequestDTO)
      .then((res) => res.data),

  delete: (id) =>
    axiosInstance.delete(`/borrowings/${id}`).then((res) => res.data),

  returnBook: (id) =>
    axiosInstance.patch(`/borrowings/${id}/return`).then((res) => res.data),

  searchByStatus: (statut) =>
    axiosInstance
      .get(`/borrowings/search/status/${statut}`)
      .then((res) => res.data),

  // startDate / endDate must be ISO "yyyy-MM-dd" strings
  searchBetweenDates: (startDate, endDate) =>
    axiosInstance
      .get('/borrowings/search/dates', { params: { startDate, endDate } })
      .then((res) => res.data),
};

export default borrowingService;
