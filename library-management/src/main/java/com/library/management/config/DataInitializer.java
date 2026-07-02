package com.library.management.config;

import com.library.management.entity.*;
import com.library.management.repository.AuthorRepository;
import com.library.management.repository.BookRepository;
import com.library.management.repository.BorrowingRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/**
 * Seeds the database with sample data on application startup:
 * 3 authors, 8 books, 5 borrowings.
 * Only runs when the repositories are empty, to avoid duplicating data on restart.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final AuthorRepository authorRepository;
    private final BookRepository bookRepository;
    private final BorrowingRepository borrowingRepository;

    // Constructor injection (no field injection)
    public DataInitializer(AuthorRepository authorRepository,
                            BookRepository bookRepository,
                            BorrowingRepository borrowingRepository) {
        this.authorRepository = authorRepository;
        this.bookRepository = bookRepository;
        this.borrowingRepository = borrowingRepository;
    }

    @Override
    public void run(String... args) {
        if (authorRepository.count() > 0) {
            return; // data already initialized
        }

        // ---- Authors ----
        Author victorHugo = authorRepository.save(
                Author.builder().nom("Victor Hugo").nationalite("Francaise").build());
        Author isaacAsimov = authorRepository.save(
                Author.builder().nom("Isaac Asimov").nationalite("Americaine").build());
        Author yuvalHarari = authorRepository.save(
                Author.builder().nom("Yuval Noah Harari").nationalite("Israelienne").build());

        // ---- Books ----
        Book book1 = bookRepository.save(Book.builder()
                .titre("Les Miserables")
                .isbn("978-2-07-040584-1")
                .categorie(Category.ROMAN)
                .dateParution(LocalDate.of(1862, 1, 1))
                .disponible(true)
                .auteur(victorHugo)
                .build());

        Book book2 = bookRepository.save(Book.builder()
                .titre("Notre-Dame de Paris")
                .isbn("978-2-07-040583-4")
                .categorie(Category.ROMAN)
                .dateParution(LocalDate.of(1831, 3, 16))
                .disponible(true)
                .auteur(victorHugo)
                .build());

        Book book3 = bookRepository.save(Book.builder()
                .titre("Fondation")
                .isbn("978-2-07-041813-1")
                .categorie(Category.SCIENCE)
                .dateParution(LocalDate.of(1951, 5, 1))
                .disponible(true)
                .auteur(isaacAsimov)
                .build());

        Book book4 = bookRepository.save(Book.builder()
                .titre("Les Robots")
                .isbn("978-2-266-11902-4")
                .categorie(Category.SCIENCE)
                .dateParution(LocalDate.of(1950, 12, 2))
                .disponible(true)
                .auteur(isaacAsimov)
                .build());

        Book book5 = bookRepository.save(Book.builder()
                .titre("Le Cycle de Trantor")
                .isbn("978-2-266-11903-1")
                .categorie(Category.SCIENCE)
                .dateParution(LocalDate.of(1988, 6, 1))
                .disponible(true)
                .auteur(isaacAsimov)
                .build());

        Book book6 = bookRepository.save(Book.builder()
                .titre("Sapiens: Une breve histoire de l'humanite")
                .isbn("978-2-226-25701-7")
                .categorie(Category.HISTOIRE)
                .dateParution(LocalDate.of(2011, 1, 1))
                .disponible(true)
                .auteur(yuvalHarari)
                .build());

        Book book7 = bookRepository.save(Book.builder()
                .titre("Homo Deus: Une breve histoire de l'avenir")
                .isbn("978-2-226-31905-0")
                .categorie(Category.HISTOIRE)
                .dateParution(LocalDate.of(2015, 1, 1))
                .disponible(true)
                .auteur(yuvalHarari)
                .build());

        Book book8 = bookRepository.save(Book.builder()
                .titre("21 Lecons pour le XXIe siecle")
                .isbn("978-2-226-43521-6")
                .categorie(Category.HISTOIRE)
                .dateParution(LocalDate.of(2018, 1, 1))
                .disponible(true)
                .auteur(yuvalHarari)
                .build());

        // ---- Borrowings ----
        LocalDate today = LocalDate.now();

        // 1. Active, on time
        borrowingRepository.save(Borrowing.builder()
                .dateEmprunt(today.minusDays(3))
                .dateRetourPrevue(today.plusDays(11))
                .statut(BorrowStatus.EN_COURS)
                .livre(book1)
                .build());
        book1.setDisponible(false);
        bookRepository.save(book1);

        // 2. Active but overdue (EN_RETARD)
        borrowingRepository.save(Borrowing.builder()
                .dateEmprunt(today.minusDays(30))
                .dateRetourPrevue(today.minusDays(10))
                .statut(BorrowStatus.EN_RETARD)
                .livre(book3)
                .build());
        book3.setDisponible(false);
        bookRepository.save(book3);

        // 3. Already returned, on time
        borrowingRepository.save(Borrowing.builder()
                .dateEmprunt(today.minusDays(40))
                .dateRetourPrevue(today.minusDays(26))
                .dateRetourReelle(today.minusDays(28))
                .statut(BorrowStatus.RETOURNE)
                .livre(book2)
                .build());

        // 4. Already returned, late
        borrowingRepository.save(Borrowing.builder()
                .dateEmprunt(today.minusDays(60))
                .dateRetourPrevue(today.minusDays(46))
                .dateRetourReelle(today.minusDays(40))
                .statut(BorrowStatus.RETOURNE)
                .livre(book6)
                .build());

        // 5. Active, on time
        borrowingRepository.save(Borrowing.builder()
                .dateEmprunt(today.minusDays(1))
                .dateRetourPrevue(today.plusDays(13))
                .statut(BorrowStatus.EN_COURS)
                .livre(book7)
                .build());
        book7.setDisponible(false);
        bookRepository.save(book7);

        // Remaining books (book4, book5, book8) stay available for demo purposes.
        List.of(book4, book5, book8).forEach(b -> {
            b.setDisponible(true);
            bookRepository.save(b);
        });
    }
}
