package com.library.management.mapper;

import com.library.management.dto.BorrowingResponseDTO;
import com.library.management.entity.Book;
import com.library.management.entity.Borrowing;
import org.springframework.stereotype.Component;

/**
 * Maps between Borrowing entity and its DTOs.
 * Note: building the entity from BorrowingRequestDTO requires the resolved Book,
 * so that logic lives in BorrowingServiceImpl where the Book is fetched.
 */
@Component
public class BorrowingMapper {

    public BorrowingResponseDTO toResponseDto(Borrowing borrowing) {
        if (borrowing == null) {
            return null;
        }
        Book livre = borrowing.getLivre();
        return BorrowingResponseDTO.builder()
                .id(borrowing.getId())
                .dateEmprunt(borrowing.getDateEmprunt())
                .dateRetourPrevue(borrowing.getDateRetourPrevue())
                .dateRetourReelle(borrowing.getDateRetourReelle())
                .statut(borrowing.getStatut())
                .livreId(livre != null ? livre.getId() : null)
                .livreTitre(livre != null ? livre.getTitre() : null)
                .build();
    }
}
