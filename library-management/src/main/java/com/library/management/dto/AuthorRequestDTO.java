package com.library.management.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO used to create or update an Author.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthorRequestDTO {

    @NotBlank(message = "Le nom de l'auteur est obligatoire")
    private String nom;

    private String nationalite;
}
