package com.library.management.repository;

import com.library.management.entity.Book;
import com.library.management.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Book entity.
 */
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    Optional<Book> findByIsbn(String isbn);

    boolean existsByIsbn(String isbn);

    @Query("SELECT b FROM Book b WHERE b.categorie = :categorie")
    List<Book> findByCategorie(@Param("categorie") Category categorie);

    @Query("SELECT b FROM Book b WHERE b.auteur.id = :auteurId")
    List<Book> findByAuteurId(@Param("auteurId") Long auteurId);

    @Query("SELECT b FROM Book b WHERE b.disponible = :disponible")
    List<Book> findByDisponible(@Param("disponible") boolean disponible);
}
