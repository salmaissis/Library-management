package com.library.management.service.impl;

import com.library.management.dto.BorrowingRequestDTO;
import com.library.management.dto.BorrowingResponseDTO;
import com.library.management.entity.Book;
import com.library.management.entity.BorrowStatus;
import com.library.management.entity.Borrowing;
import com.library.management.exception.BookNotAvailableException;
import com.library.management.exception.InvalidBorrowingException;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.mapper.BorrowingMapper;
import com.library.management.repository.BookRepository;
import com.library.management.repository.BorrowingRepository;
import com.library.management.service.BorrowingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Implementation of {@link BorrowingService}.
 */
@Service
@Transactional
public class BorrowingServiceImpl implements BorrowingService {

    private final BorrowingRepository borrowingRepository;
    private final BookRepository bookRepository;
    private final BorrowingMapper borrowingMapper;

    // Constructor injection (no field injection)
    public BorrowingServiceImpl(BorrowingRepository borrowingRepository,
                                 BookRepository bookRepository,
                                 BorrowingMapper borrowingMapper) {
        this.borrowingRepository = borrowingRepository;
        this.bookRepository = bookRepository;
        this.borrowingMapper = borrowingMapper;
    }

    @Override
    public BorrowingResponseDTO create(BorrowingRequestDTO requestDTO) {
        // 1. Verify the book exists
        Book book = findBookOrThrow(requestDTO.getLivreId());

        // 2. Verify the book is available
        if (!book.isDisponible()) {
            throw new BookNotAvailableException(
                    "Le livre '" + book.getTitre() + "' n'est pas disponible pour l'emprunt");
        }

        // 3. Create the borrowing
        Borrowing borrowing = Borrowing.builder()
                .dateEmprunt(requestDTO.getDateEmprunt())
                .dateRetourPrevue(requestDTO.getDateRetourPrevue())
                .statut(BorrowStatus.EN_COURS)
                .livre(book)
                .build();

        // 4. Automatically mark the book as unavailable
        book.setDisponible(false);
        bookRepository.save(book);

        Borrowing saved = borrowingRepository.save(borrowing);
        refreshStatus(saved);
        return borrowingMapper.toResponseDto(saved);
    }

    @Override
    public BorrowingResponseDTO update(Long id, BorrowingRequestDTO requestDTO) {
        Borrowing borrowing = findBorrowingOrThrow(id);

        if (borrowing.getStatut() == BorrowStatus.RETOURNE) {
            throw new InvalidBorrowingException("Impossible de modifier un emprunt deja retourne");
        }

        // Allow re-assigning the borrowed book if requested
        if (!borrowing.getLivre().getId().equals(requestDTO.getLivreId())) {
            Book newBook = findBookOrThrow(requestDTO.getLivreId());
            if (!newBook.isDisponible()) {
                throw new BookNotAvailableException(
                        "Le livre '" + newBook.getTitre() + "' n'est pas disponible pour l'emprunt");
            }
            // free the previous book, reserve the new one
            Book previousBook = borrowing.getLivre();
            previousBook.setDisponible(true);
            bookRepository.save(previousBook);

            newBook.setDisponible(false);
            bookRepository.save(newBook);

            borrowing.setLivre(newBook);
        }

        borrowing.setDateEmprunt(requestDTO.getDateEmprunt());
        borrowing.setDateRetourPrevue(requestDTO.getDateRetourPrevue());

        Borrowing updated = borrowingRepository.save(borrowing);
        refreshStatus(updated);
        return borrowingMapper.toResponseDto(updated);
    }

    @Override
    public BorrowingResponseDTO returnBook(Long id) {
        Borrowing borrowing = findBorrowingOrThrow(id);

        if (borrowing.getStatut() == BorrowStatus.RETOURNE) {
            throw new InvalidBorrowingException("Cet emprunt a deja ete retourne");
        }

        // Set the actual return date
        borrowing.setDateRetourReelle(LocalDate.now());
        borrowing.setStatut(BorrowStatus.RETOURNE);

        // Mark the book as available again
        Book book = borrowing.getLivre();
        book.setDisponible(true);
        bookRepository.save(book);

        Borrowing updated = borrowingRepository.save(borrowing);
        return borrowingMapper.toResponseDto(updated);
    }

    @Override
    public void delete(Long id) {
        Borrowing borrowing = findBorrowingOrThrow(id);

        // If the borrowing was still active, free up the book before deleting
        if (borrowing.getStatut() != BorrowStatus.RETOURNE) {
            Book book = borrowing.getLivre();
            book.setDisponible(true);
            bookRepository.save(book);
        }

        borrowingRepository.delete(borrowing);
    }

    @Override
    @Transactional(readOnly = true)
    public BorrowingResponseDTO getById(Long id) {
        Borrowing borrowing = findBorrowingOrThrow(id);
        refreshStatus(borrowing);
        return borrowingMapper.toResponseDto(borrowing);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BorrowingResponseDTO> getAll() {
        List<Borrowing> borrowings = borrowingRepository.findAll();
        borrowings.forEach(this::refreshStatus);
        return borrowings.stream()
                .map(borrowingMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BorrowingResponseDTO> searchByStatus(BorrowStatus statut) {
        List<Borrowing> borrowings = borrowingRepository.findByStatut(statut);
        borrowings.forEach(this::refreshStatus);
        return borrowings.stream()
                .map(borrowingMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BorrowingResponseDTO> searchBetweenDates(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null || startDate.isAfter(endDate)) {
            throw new InvalidBorrowingException(
                    "La date de debut doit etre anterieure ou egale a la date de fin");
        }
        List<Borrowing> borrowings = borrowingRepository.findByDateEmpruntBetween(startDate, endDate);
        borrowings.forEach(this::refreshStatus);
        return borrowings.stream()
                .map(borrowingMapper::toResponseDto)
                .toList();
    }

    /**
     * Recomputes the status of a borrowing: if it is still EN_COURS but the expected
     * return date has already passed, its status becomes EN_RETARD.
     */
    private void refreshStatus(Borrowing borrowing) {
        if (borrowing.getStatut() == BorrowStatus.EN_COURS
                && borrowing.getDateRetourReelle() == null
                && borrowing.getDateRetourPrevue() != null
                && LocalDate.now().isAfter(borrowing.getDateRetourPrevue())) {
            borrowing.setStatut(BorrowStatus.EN_RETARD);
            borrowingRepository.save(borrowing);
        }
    }

    private Borrowing findBorrowingOrThrow(Long id) {
        return borrowingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emprunt introuvable avec id: " + id));
    }

    private Book findBookOrThrow(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Livre introuvable avec id: " + id));
    }
}
