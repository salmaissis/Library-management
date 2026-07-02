package com.library.management.dto;

import com.library.management.entity.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO used to create or update a Book.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookRequestDTO {

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    @NotBlank(message = "L'ISBN est obligatoire")
    private String isbn;

    @NotNull(message = "La categorie est obligatoire")
    private Category categorie;

    @NotNull(message = "La date de parution est obligatoire")
    @PastOrPresent(message = "La date de parution ne peut pas etre dans le futur")
    private LocalDate dateParution;

    @NotNull(message = "L'identifiant de l'auteur est obligatoire")
    private Long auteurId;

    /**
     * Optional at creation time; defaults to true (available) when not provided.
     */
    private Boolean disponible;
}
