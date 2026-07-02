# Library Management System (Gestion de Bibliotheque)

Complete Spring Boot 3 REST API for managing Authors, Books, and Borrowings.

## Stack

- Java 17
- Spring Boot 3.3.4
- Spring Web, Spring Data JPA, Spring Validation
- PostgreSQL (default) / H2 (optional, for quick local testing)
- Lombok
- springdoc-openapi (Swagger UI)
- Maven

## Project layout

```
src/main/java/com/library/management/
  controller/       REST controllers (delegate only, no business logic)
  service/          Service interfaces
  service/impl/     Service implementations (business logic)
  repository/       Spring Data JPA repositories with custom JPQL
  entity/           JPA entities + enums (Category, BorrowStatus)
  dto/              Request/response DTOs (entities are never exposed directly)
  mapper/           Entity <-> DTO mapping
  exception/        Custom exceptions + @ControllerAdvice global handler
  config/           OpenAPI config + CommandLineRunner data seeder
```

## Running with PostgreSQL (default)

1. Create a database:
   ```sql
   CREATE DATABASE library_db;
   ```
2. Update credentials in `src/main/resources/application.properties` if needed
   (defaults: `postgres` / `password`).
3. Run:
   ```bash
   mvn spring-boot:run
   ```

## Running with H2 (no PostgreSQL needed)

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

H2 console available at `http://localhost:8080/h2-console`
(JDBC URL: `jdbc:h2:mem:library_db`, user: `sa`, empty password).

## Swagger UI

Once the app is running:

- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI spec: http://localhost:8080/v3/api-docs

## Sample data

On first startup, `DataInitializer` seeds:
- 3 authors (Victor Hugo, Isaac Asimov, Yuval Noah Harari)
- 8 books across ROMAN, SCIENCE, HISTOIRE categories
- 5 borrowings covering all statuses (EN_COURS, EN_RETARD, RETOURNE)

## Key endpoints

| Resource   | Base path            |
|------------|-----------------------|
| Authors    | `/api/authors`         |
| Books      | `/api/books`            |
| Borrowings | `/api/borrowings`       |
| Statistics | `/api/statistics`       |

Notable extra endpoints:
- `GET /api/books/search/category/{categorie}`
- `GET /api/books/search/author/{auteurId}`
- `GET /api/books/search/availability?disponible=true`
- `PATCH /api/books/{id}/mark-available` / `mark-unavailable`
- `PATCH /api/borrowings/{id}/return`
- `GET /api/borrowings/search/status/{statut}`
- `GET /api/borrowings/search/dates?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- `GET /api/statistics/borrowings-per-month`
- `GET /api/statistics/top-authors`
- `GET /api/statistics/late-rate`

## Business rules implemented

- Creating a borrowing verifies the book exists and is available, then marks it unavailable.
- Returning a book sets the actual return date, frees the book, and sets status to RETOURNE.
- Any EN_COURS borrowing whose expected return date has passed is automatically flagged EN_RETARD
  (recomputed on read, and bulk-refreshed before computing the late-rate statistic).
- ISBN uniqueness, required fields, and "publication date not in the future" are validated
  at the DTO layer (Bean Validation) and/or service layer.

## Notes

This project was generated in a sandboxed environment without access to Maven Central,
so it has not been build-verified with `mvn compile`. The code was manually reviewed for
syntax correctness, consistent imports, and cross-references between layers. Please run
`mvn clean install` in an environment with internet access to complete the first build.
