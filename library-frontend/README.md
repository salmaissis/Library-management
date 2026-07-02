# Library Manager — React Frontend

A React 18 + Vite + Material UI admin dashboard for the Spring Boot
`library-management` backend, built directly from its controllers, DTOs,
entities, and enums.

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`. Start the Spring Boot backend on
`http://localhost:8080` first (e.g. `mvn spring-boot:run -Dspring-boot.run.profiles=h2`
for the in-memory H2 profile, or the default PostgreSQL profile).

## CORS / API connectivity

The backend does **not** define a `@CrossOrigin` policy or a global CORS
`WebMvcConfigurer`. To avoid CORS errors in development, `vite.config.js`
proxies every `/api/*` request to `http://localhost:8080`, and
`src/services/axiosInstance.js` defaults its `baseURL` to `/api`. You don't
need to change anything for local development.

For a production build served from a different origin than the API, either:
- add a CORS configuration to the Spring Boot backend, and set
  `VITE_API_BASE_URL` (see `.env.example`) to the backend's full URL, or
- serve the built frontend behind the same reverse-proxy origin as the API.

## Notes on the backend contract

- All request/response field names match the backend DTOs exactly (French
  field names such as `titre`, `isbn`, `categorie`, `dateParution`,
  `auteurId`, `disponible`, `livreId`, `dateEmprunt`, `dateRetourPrevue`,
  `dateRetourReelle`, `statut`, `nom`, `nationalite`).
- `Category` enum values: `ROMAN`, `SCIENCE`, `HISTOIRE`, `INFORMATIQUE`,
  `JEUNESSE`, `AUTRE`.
- `BorrowStatus` enum values: `EN_COURS`, `RETOURNE`, `EN_RETARD`.
- The backend does **not** expose a "search author by name" endpoint, so the
  Authors page filters the full author list client-side.
- Books/Authors/Borrowings filters (category, author, availability, status,
  date range) are applied client-side against `GET /{resource}` rather than
  chaining the backend's individual `search/...` endpoints, so multiple
  filters can be combined at once.
- Error responses are parsed from the backend's `ErrorResponse` shape
  (`status`, `message`, `fieldErrors`) and shown via SweetAlert2, with
  specific handling for 400 (validation / bad request), 404 (not found),
  409 (conflict — e.g. duplicate ISBN or borrowing an unavailable book), and
  500 (server error).

## Project structure

```
src/
  components/
    layout/       Sidebar, Navbar, Layout
    common/        PageHeader, SearchBar, ConfirmDialog, LoadingSpinner,
                    EmptyState, DataTable, StatCard, StatusChip
  pages/
    Dashboard.jsx
    Books/         BooksPage, BookFormDialog
    Authors/       AuthorsPage, AuthorFormDialog
    Borrowings/    BorrowingsPage, BorrowingFormDialog
    Statistics/    StatisticsPage
    NotFound.jsx
  services/        axiosInstance, bookService, authorService,
                    borrowingService, statisticsService
  hooks/           useFetch
  utils/           constants (enums/labels), errorHandler
  theme.js
  App.jsx
  main.jsx
```
