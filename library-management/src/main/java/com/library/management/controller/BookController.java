package com.library.management.controller;

import com.library.management.dto.BookRequestDTO;
import com.library.management.dto.BookResponseDTO;
import com.library.management.entity.Category;
import com.library.management.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller exposing CRUD and search endpoints for Book.
 * Controllers only delegate to the service layer; no business logic here.
 */
@RestController
@RequestMapping("/api/books")
@Tag(name = "Books", description = "Gestion des livres")
public class BookController {

    private final BookService bookService;

    // Constructor injection (no field injection)
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @Operation(summary = "Creer un livre", description = "Cree un nouveau livre")
    @PostMapping
    public ResponseEntity<BookResponseDTO> create(@Valid @RequestBody BookRequestDTO requestDTO) {
        BookResponseDTO created = bookService.create(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Mettre a jour un livre", description = "Met a jour un livre existant par son id")
    @PutMapping("/{id}")
    public ResponseEntity<BookResponseDTO> update(@PathVariable Long id,
                                                    @Valid @RequestBody BookRequestDTO requestDTO) {
        BookResponseDTO updated = bookService.update(id, requestDTO);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Supprimer un livre", description = "Supprime un livre par son id")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Recuperer un livre", description = "Recupere un livre par son id")
    @GetMapping("/{id}")
    public ResponseEntity<BookResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getById(id));
    }

    @Operation(summary = "Lister les livres", description = "Recupere la liste de tous les livres")
    @GetMapping
    public ResponseEntity<List<BookResponseDTO>> getAll() {
        return ResponseEntity.ok(bookService.getAll());
    }

    @Operation(summary = "Rechercher par categorie", description = "Recupere les livres d'une categorie donnee")
    @GetMapping("/search/category/{categorie}")
    public ResponseEntity<List<BookResponseDTO>> searchByCategory(@PathVariable Category categorie) {
        return ResponseEntity.ok(bookService.searchByCategory(categorie));
    }

    @Operation(summary = "Rechercher par auteur", description = "Recupere les livres d'un auteur donne")
    @GetMapping("/search/author/{auteurId}")
    public ResponseEntity<List<BookResponseDTO>> searchByAuthor(@PathVariable Long auteurId) {
        return ResponseEntity.ok(bookService.searchByAuthor(auteurId));
    }

    @Operation(summary = "Rechercher par disponibilite", description = "Recupere les livres disponibles ou non")
    @GetMapping("/search/availability")
    public ResponseEntity<List<BookResponseDTO>> searchByAvailability(
            @RequestParam boolean disponible) {
        return ResponseEntity.ok(bookService.searchByAvailability(disponible));
    }

    @Operation(summary = "Marquer disponible", description = "Marque un livre comme disponible")
    @PatchMapping("/{id}/mark-available")
    public ResponseEntity<BookResponseDTO> markAvailable(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.markAvailable(id));
    }

    @Operation(summary = "Marquer indisponible", description = "Marque un livre comme indisponible")
    @PatchMapping("/{id}/mark-unavailable")
    public ResponseEntity<BookResponseDTO> markUnavailable(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.markUnavailable(id));
    }
}
