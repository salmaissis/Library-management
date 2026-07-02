package com.library.management.controller;

import com.library.management.dto.BorrowingRequestDTO;
import com.library.management.dto.BorrowingResponseDTO;
import com.library.management.entity.BorrowStatus;
import com.library.management.service.BorrowingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST controller exposing CRUD and search endpoints for Borrowing.
 * Controllers only delegate to the service layer; no business logic here.
 */
@RestController
@RequestMapping("/api/borrowings")
@Tag(name = "Borrowings", description = "Gestion des emprunts")
public class BorrowingController {

    private final BorrowingService borrowingService;

    // Constructor injection (no field injection)
    public BorrowingController(BorrowingService borrowingService) {
        this.borrowingService = borrowingService;
    }

    @Operation(summary = "Creer un emprunt", description = "Cree un nouvel emprunt et marque le livre comme indisponible")
    @PostMapping
    public ResponseEntity<BorrowingResponseDTO> create(@Valid @RequestBody BorrowingRequestDTO requestDTO) {
        BorrowingResponseDTO created = borrowingService.create(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Retourner un livre", description = "Cloture un emprunt: fixe la date de retour reelle et remet le livre disponible")
    @PatchMapping("/{id}/return")
    public ResponseEntity<BorrowingResponseDTO> returnBook(@PathVariable Long id) {
        return ResponseEntity.ok(borrowingService.returnBook(id));
    }

    @Operation(summary = "Mettre a jour un emprunt", description = "Met a jour un emprunt existant par son id")
    @PutMapping("/{id}")
    public ResponseEntity<BorrowingResponseDTO> update(@PathVariable Long id,
                                                         @Valid @RequestBody BorrowingRequestDTO requestDTO) {
        BorrowingResponseDTO updated = borrowingService.update(id, requestDTO);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Supprimer un emprunt", description = "Supprime un emprunt par son id")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        borrowingService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Recuperer un emprunt", description = "Recupere un emprunt par son id")
    @GetMapping("/{id}")
    public ResponseEntity<BorrowingResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(borrowingService.getById(id));
    }

    @Operation(summary = "Lister les emprunts", description = "Recupere la liste de tous les emprunts")
    @GetMapping
    public ResponseEntity<List<BorrowingResponseDTO>> getAll() {
        return ResponseEntity.ok(borrowingService.getAll());
    }

    @Operation(summary = "Rechercher par statut", description = "Recupere les emprunts ayant un statut donne")
    @GetMapping("/search/status/{statut}")
    public ResponseEntity<List<BorrowingResponseDTO>> searchByStatus(@PathVariable BorrowStatus statut) {
        return ResponseEntity.ok(borrowingService.searchByStatus(statut));
    }

    @Operation(summary = "Rechercher entre deux dates", description = "Recupere les emprunts dont la date d'emprunt est comprise entre deux dates")
    @GetMapping("/search/dates")
    public ResponseEntity<List<BorrowingResponseDTO>> searchBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(borrowingService.searchBetweenDates(startDate, endDate));
    }
}
