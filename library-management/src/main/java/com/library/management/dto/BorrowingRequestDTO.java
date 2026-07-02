package com.library.management.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO used to create or update a Borrowing.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BorrowingRequestDTO {

    @NotNull(message = "L'identifiant du livre est obligatoire")
    private Long livreId;

    @NotNull(message = "La date d'emprunt est obligatoire")
    private LocalDate dateEmprunt;

    @NotNull(message = "La date de retour prevue est obligatoire")
    private LocalDate dateRetourPrevue;

    /**
     * Cross-field validation: the expected return date must be strictly after
     * the borrowing date.
     */
    @AssertTrue(message = "La date de retour prevue doit etre posterieure a la date d'emprunt")
    public boolean isDateRetourPrevueValide() {
        if (dateEmprunt == null || dateRetourPrevue == null) {
            return true; // handled by @NotNull already
        }
        return dateRetourPrevue.isAfter(dateEmprunt);
    }
}
