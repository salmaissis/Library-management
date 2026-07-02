package com.library.management.mapper;

import com.library.management.dto.BookResponseDTO;
import com.library.management.entity.Author;
import com.library.management.entity.Book;
import org.springframework.stereotype.Component;

/**
 * Maps between Book entity and its DTOs.
 * Note: building the entity from BookRequestDTO requires the resolved Author,
 * so that logic lives in BookServiceImpl where the Author is fetched.
 */
@Component
public class BookMapper {

    public BookResponseDTO toResponseDto(Book book) {
        if (book == null) {
            return null;
        }
        Author auteur = book.getAuteur();
        return BookResponseDTO.builder()
                .id(book.getId())
                .titre(book.getTitre())
                .isbn(book.getIsbn())
                .categorie(book.getCategorie())
                .dateParution(book.getDateParution())
                .disponible(book.isDisponible())
                .auteurId(auteur != null ? auteur.getId() : null)
                .auteurNom(auteur != null ? auteur.getNom() : null)
                .build();
    }
}
