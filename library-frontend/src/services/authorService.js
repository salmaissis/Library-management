import axiosInstance from './axiosInstance';

// Mirrors com.library.management.controller.AuthorController
// Base path: /api/authors
// Note: the backend does NOT expose a "search by name" endpoint, so name
// search is done client-side in AuthorsPage against the full author list.
const authorService = {
  getAll: () => axiosInstance.get('/authors').then((res) => res.data),

  getById: (id) => axiosInstance.get(`/authors/${id}`).then((res) => res.data),

  // requestBody matches AuthorRequestDTO: { nom, nationalite? }
  create: (authorRequestDTO) =>
    axiosInstance.post('/authors', authorRequestDTO).then((res) => res.data),

  update: (id, authorRequestDTO) =>
    axiosInstance
      .put(`/authors/${id}`, authorRequestDTO)
      .then((res) => res.data),

  delete: (id) => axiosInstance.delete(`/authors/${id}`).then((res) => res.data),
};

export default authorService;
