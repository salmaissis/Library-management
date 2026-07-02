package com.library.management.controller;

import com.library.management.dto.AuthorRequestDTO;
import com.library.management.dto.AuthorResponseDTO;
import com.library.management.service.AuthorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller exposing CRUD endpoints for Author.
 * Controllers only delegate to the service layer; no business logic here.
 */
@RestController
@RequestMapping("/api/authors")
@Tag(name = "Authors", description = "Gestion des auteurs")
public class AuthorController {

    private final AuthorService authorService;

    // Constructor injection (no field injection)
    public AuthorController(AuthorService authorService) {
        this.authorService = authorService;
    }

    @Operation(summary = "Creer un auteur", description = "Cree un nouvel auteur")
    @PostMapping
    public ResponseEntity<AuthorResponseDTO> create(@Valid @RequestBody AuthorRequestDTO requestDTO) {
        AuthorResponseDTO created = authorService.create(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Mettre a jour un auteur", description = "Met a jour un auteur existant par son id")
    @PutMapping("/{id}")
    public ResponseEntity<AuthorResponseDTO> update(@PathVariable Long id,
                                                      @Valid @RequestBody AuthorRequestDTO requestDTO) {
        AuthorResponseDTO updated = authorService.update(id, requestDTO);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Supprimer un auteur", description = "Supprime un auteur par son id")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        authorService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Recuperer un auteur", description = "Recupere un auteur par son id")
    @GetMapping("/{id}")
    public ResponseEntity<AuthorResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(authorService.getById(id));
    }

    @Operation(summary = "Lister les auteurs", description = "Recupere la liste de tous les auteurs")
    @GetMapping
    public ResponseEntity<List<AuthorResponseDTO>> getAll() {
        return ResponseEntity.ok(authorService.getAll());
    }
}
