package com.library.management.repository;

import com.library.management.entity.BorrowStatus;
import com.library.management.entity.Borrowing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository for Borrowing entity.
 */
@Repository
public interface BorrowingRepository extends JpaRepository<Borrowing, Long> {

    @Query("SELECT b FROM Borrowing b WHERE b.statut = :statut")
    List<Borrowing> findByStatut(@Param("statut") BorrowStatus statut);

    @Query("SELECT b FROM Borrowing b WHERE b.dateEmprunt BETWEEN :startDate AND :endDate")
    List<Borrowing> findByDateEmpruntBetween(@Param("startDate") LocalDate startDate,
                                              @Param("endDate") LocalDate endDate);

    @Query("SELECT b FROM Borrowing b WHERE b.livre.id = :livreId AND b.statut = 'EN_COURS'")
    List<Borrowing> findActiveBorrowingsByLivreId(@Param("livreId") Long livreId);

    /**
     * Borrowings currently EN_COURS whose expected return date has already passed.
     * Used to compute/refresh late status.
     */
    @Query("SELECT b FROM Borrowing b WHERE b.statut = 'EN_COURS' AND b.dateRetourPrevue < :today")
    List<Borrowing> findOverdueActiveBorrowings(@Param("today") LocalDate today);

    /**
     * Statistics: number of borrowings grouped by year-month.
     * Returns rows of [year (int), month (int), count (long)].
     */
    @Query(value = "SELECT EXTRACT(YEAR FROM b.date_emprunt), EXTRACT(MONTH FROM b.date_emprunt), COUNT(b.id) " +
            "FROM borrowings b " +
            "GROUP BY EXTRACT(YEAR FROM b.date_emprunt), EXTRACT(MONTH FROM b.date_emprunt) " +
            "ORDER BY EXTRACT(YEAR FROM b.date_emprunt), EXTRACT(MONTH FROM b.date_emprunt)",
            nativeQuery = true)
    List<Object[]> countBorrowingsPerMonth();

    /**
     * Statistics: authors ranked by number of borrowings (descending).
     * Returns rows of [authorId (Long), authorName (String), count (long)].
     */
    @Query("SELECT a.id, a.nom, COUNT(b) " +
            "FROM Borrowing b JOIN b.livre l JOIN l.auteur a " +
            "GROUP BY a.id, a.nom " +
            "ORDER BY COUNT(b) DESC")
    List<Object[]> countBorrowingsPerAuthor();

    long countByStatut(BorrowStatus statut);

    /**
     * Bulk-updates all EN_COURS borrowings whose expected return date has passed
     * to EN_RETARD. Used to keep statistics accurate without loading entities one by one.
     */
    @Modifying
    @Query("UPDATE Borrowing b SET b.statut = 'EN_RETARD' " +
            "WHERE b.statut = 'EN_COURS' AND b.dateRetourPrevue < :today")
    int markOverdueBorrowingsAsLate(@Param("today") LocalDate today);
}
