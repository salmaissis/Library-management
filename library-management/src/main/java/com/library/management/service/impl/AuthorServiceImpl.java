package com.library.management.service.impl;

import com.library.management.dto.AuthorRequestDTO;
import com.library.management.dto.AuthorResponseDTO;
import com.library.management.entity.Author;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.mapper.AuthorMapper;
import com.library.management.repository.AuthorRepository;
import com.library.management.service.AuthorService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Implementation of {@link AuthorService}.
 */
@Service
@Transactional
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepository authorRepository;
    private final AuthorMapper authorMapper;

    // Constructor injection (no field injection)
    public AuthorServiceImpl(AuthorRepository authorRepository, AuthorMapper authorMapper) {
        this.authorRepository = authorRepository;
        this.authorMapper = authorMapper;
    }

    @Override
    public AuthorResponseDTO create(AuthorRequestDTO requestDTO) {
        Author author = authorMapper.toEntity(requestDTO);
        Author saved = authorRepository.save(author);
        return authorMapper.toResponseDto(saved);
    }

    @Override
    public AuthorResponseDTO update(Long id, AuthorRequestDTO requestDTO) {
        Author author = findAuthorOrThrow(id);
        authorMapper.updateEntityFromDto(requestDTO, author);
        Author updated = authorRepository.save(author);
        return authorMapper.toResponseDto(updated);
    }

    @Override
    public void delete(Long id) {
        Author author = findAuthorOrThrow(id);
        authorRepository.delete(author);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthorResponseDTO getById(Long id) {
        return authorMapper.toResponseDto(findAuthorOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuthorResponseDTO> getAll() {
        return authorRepository.findAll()
                .stream()
                .map(authorMapper::toResponseDto)
                .toList();
    }

    private Author findAuthorOrThrow(Long id) {
        return authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Auteur introuvable avec id: " + id));
    }
}
