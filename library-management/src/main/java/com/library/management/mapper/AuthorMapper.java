package com.library.management.mapper;

import com.library.management.dto.AuthorRequestDTO;
import com.library.management.dto.AuthorResponseDTO;
import com.library.management.entity.Author;
import org.springframework.stereotype.Component;

/**
 * Maps between Author entity and its DTOs.
 */
@Component
public class AuthorMapper {

    public Author toEntity(AuthorRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        return Author.builder()
                .nom(dto.getNom())
                .nationalite(dto.getNationalite())
                .build();
    }

    public void updateEntityFromDto(AuthorRequestDTO dto, Author author) {
        author.setNom(dto.getNom());
        author.setNationalite(dto.getNationalite());
    }

    public AuthorResponseDTO toResponseDto(Author author) {
        if (author == null) {
            return null;
        }
        int nombreLivres = author.getBooks() != null ? author.getBooks().size() : 0;
        return AuthorResponseDTO.builder()
                .id(author.getId())
                .nom(author.getNom())
                .nationalite(author.getNationalite())
                .nombreLivres(nombreLivres)
                .build();
    }
}
