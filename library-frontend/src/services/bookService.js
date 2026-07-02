import axiosInstance from './axiosInstance';

// Mirrors com.library.management.controller.BookController
// Base path: /api/books
const bookService = {
  getAll: () => axiosInstance.get('/books').then((res) => res.data),

  getById: (id) => axiosInstance.get(`/books/${id}`).then((res) => res.data),

  // requestBody matches BookRequestDTO:
  // { titre, isbn, categorie, dateParution, auteurId, disponible? }
  create: (bookRequestDTO) =>
    axiosInstance.post('/books', bookRequestDTO).then((res) => res.data),

  update: (id, bookRequestDTO) =>
    axiosInstance.put(`/books/${id}`, bookRequestDTO).then((res) => res.data),

  delete: (id) => axiosInstance.delete(`/books/${id}`).then((res) => res.data),

  searchByCategory: (categorie) =>
    axiosInstance
      .get(`/books/search/category/${categorie}`)
      .then((res) => res.data),

  searchByAuthor: (auteurId) =>
    axiosInstance
      .get(`/books/search/author/${auteurId}`)
      .then((res) => res.data),

  // disponible is a required boolean query param
  searchByAvailability: (disponible) =>
    axiosInstance
      .get('/books/search/availability', { params: { disponible } })
      .then((res) => res.data),

  markAvailable: (id) =>
    axiosInstance.patch(`/books/${id}/mark-available`).then((res) => res.data),

  markUnavailable: (id) =>
    axiosInstance
      .patch(`/books/${id}/mark-unavailable`)
      .then((res) => res.data),
};

export default bookService;
