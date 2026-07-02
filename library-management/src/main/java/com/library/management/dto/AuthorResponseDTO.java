package com.library.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO returned to clients when exposing Author data.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorResponseDTO {

    private Long id;
    private String nom;
    private String nationalite;
    private int nombreLivres;
}
