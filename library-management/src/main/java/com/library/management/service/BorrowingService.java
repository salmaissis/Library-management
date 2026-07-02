package com.library.management.service;

import com.library.management.dto.BorrowingRequestDTO;
import com.library.management.dto.BorrowingResponseDTO;
import com.library.management.entity.BorrowStatus;

import java.time.LocalDate;
import java.util.List;

/**
 * Business operations for Borrowing.
 */
public interface BorrowingService {

    BorrowingResponseDTO create(BorrowingRequestDTO requestDTO);

    BorrowingResponseDTO update(Long id, BorrowingRequestDTO requestDTO);

    BorrowingResponseDTO returnBook(Long id);

    void delete(Long id);

    BorrowingResponseDTO getById(Long id);

    List<BorrowingResponseDTO> getAll();

    List<BorrowingResponseDTO> searchByStatus(BorrowStatus statut);

    List<BorrowingResponseDTO> searchBetweenDates(LocalDate startDate, LocalDate endDate);
}
