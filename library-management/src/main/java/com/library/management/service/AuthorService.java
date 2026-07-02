package com.library.management.service;

import com.library.management.dto.AuthorRequestDTO;
import com.library.management.dto.AuthorResponseDTO;

import java.util.List;

/**
 * Business operations for Author.
 */
public interface AuthorService {

    AuthorResponseDTO create(AuthorRequestDTO requestDTO);

    AuthorResponseDTO update(Long id, AuthorRequestDTO requestDTO);

    void delete(Long id);

    AuthorResponseDTO getById(Long id);

    List<AuthorResponseDTO> getAll();
}
