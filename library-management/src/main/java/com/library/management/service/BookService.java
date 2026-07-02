package com.library.management.service;

import com.library.management.dto.BookRequestDTO;
import com.library.management.dto.BookResponseDTO;
import com.library.management.entity.Category;

import java.util.List;

/**
 * Business operations for Book.
 */
public interface BookService {

    BookResponseDTO create(BookRequestDTO requestDTO);

    BookResponseDTO update(Long id, BookRequestDTO requestDTO);

    void delete(Long id);

    BookResponseDTO getById(Long id);

    List<BookResponseDTO> getAll();

    List<BookResponseDTO> searchByCategory(Category categorie);

    List<BookResponseDTO> searchByAuthor(Long auteurId);

    List<BookResponseDTO> searchByAvailability(boolean disponible);

    BookResponseDTO markAvailable(Long id);

    BookResponseDTO markUnavailable(Long id);
}
