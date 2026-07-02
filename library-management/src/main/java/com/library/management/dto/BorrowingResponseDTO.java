package com.library.management.dto;

import com.library.management.entity.BorrowStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO returned to clients when exposing Borrowing data.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BorrowingResponseDTO {

    private Long id;
    private LocalDate dateEmprunt;
    private LocalDate dateRetourPrevue;
    private LocalDate dateRetourReelle;
    private BorrowStatus statut;
    private Long livreId;
    private String livreTitre;
}
