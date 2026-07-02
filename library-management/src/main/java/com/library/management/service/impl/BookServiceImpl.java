package com.library.management.service.impl;

import com.library.management.dto.BookRequestDTO;
import com.library.management.dto.BookResponseDTO;
import com.library.management.entity.Author;
import com.library.management.entity.Book;
import com.library.management.entity.Category;
import com.library.management.exception.DuplicateIsbnException;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.mapper.BookMapper;
import com.library.management.repository.AuthorRepository;
import com.library.management.repository.BookRepository;
import com.library.management.service.BookService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Implementation of {@link BookService}.
 */
@Service
@Transactional
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final BookMapper bookMapper;

    // Constructor injection (no field injection)
    public BookServiceImpl(BookRepository bookRepository,
                            AuthorRepository authorRepository,
                            BookMapper bookMapper) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.bookMapper = bookMapper;
    }

    @Override
    public BookResponseDTO create(BookRequestDTO requestDTO) {
        if (bookRepository.existsByIsbn(requestDTO.getIsbn())) {
            throw new DuplicateIsbnException("Un livre avec l'ISBN '" + requestDTO.getIsbn() + "' existe deja");
        }

        Author auteur = findAuthorOrThrow(requestDTO.getAuteurId());

        Book book = Book.builder()
                .titre(requestDTO.getTitre())
                .isbn(requestDTO.getIsbn())
                .categorie(requestDTO.getCategorie())
                .dateParution(requestDTO.getDateParution())
                .disponible(requestDTO.getDisponible() == null || requestDTO.getDisponible())
                .auteur(auteur)
                .build();

        Book saved = bookRepository.save(book);
        return bookMapper.toResponseDto(saved);
    }

    @Override
    public BookResponseDTO update(Long id, BookRequestDTO requestDTO) {
        Book book = findBookOrThrow(id);

        // If ISBN changed, ensure new one is not already used by another book
        if (!book.getIsbn().equals(requestDTO.getIsbn()) && bookRepository.existsByIsbn(requestDTO.getIsbn())) {
            throw new DuplicateIsbnException("Un livre avec l'ISBN '" + requestDTO.getIsbn() + "' existe deja");
        }

        Author auteur = findAuthorOrThrow(requestDTO.getAuteurId());

        book.setTitre(requestDTO.getTitre());
        book.setIsbn(requestDTO.getIsbn());
        book.setCategorie(requestDTO.getCategorie());
        book.setDateParution(requestDTO.getDateParution());
        if (requestDTO.getDisponible() != null) {
            book.setDisponible(requestDTO.getDisponible());
        }
        book.setAuteur(auteur);

        Book updated = bookRepository.save(book);
        return bookMapper.toResponseDto(updated);
    }

    @Override
    public void delete(Long id) {
        Book book = findBookOrThrow(id);
        bookRepository.delete(book);
    }

    @Override
    @Transactional(readOnly = true)
    public BookResponseDTO getById(Long id) {
        return bookMapper.toResponseDto(findBookOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookResponseDTO> getAll() {
        return bookRepository.findAll()
                .stream()
                .map(bookMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookResponseDTO> searchByCategory(Category categorie) {
        return bookRepository.findByCategorie(categorie)
                .stream()
                .map(bookMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookResponseDTO> searchByAuthor(Long auteurId) {
        // Ensure the author exists to give a clean 404 instead of an empty list on a typo id
        findAuthorOrThrow(auteurId);
        return bookRepository.findByAuteurId(auteurId)
                .stream()
                .map(bookMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookResponseDTO> searchByAvailability(boolean disponible) {
        return bookRepository.findByDisponible(disponible)
                .stream()
                .map(bookMapper::toResponseDto)
                .toList();
    }

    @Override
    public BookResponseDTO markAvailable(Long id) {
        Book book = findBookOrThrow(id);
        book.setDisponible(true);
        return bookMapper.toResponseDto(bookRepository.save(book));
    }

    @Override
    public BookResponseDTO markUnavailable(Long id) {
        Book book = findBookOrThrow(id);
        book.setDisponible(false);
        return bookMapper.toResponseDto(bookRepository.save(book));
    }

    private Book findBookOrThrow(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Livre introuvable avec id: " + id));
    }

    private Author findAuthorOrThrow(Long id) {
        return authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Auteur introuvable avec id: " + id));
    }
}
