package com.library.management.dto;

import com.library.management.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO returned to clients when exposing Book data.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookResponseDTO {

    private Long id;
    private String titre;
    private String isbn;
    private Category categorie;
    private LocalDate dateParution;
    private boolean disponible;
    private Long auteurId;
    private String auteurNom;
}
