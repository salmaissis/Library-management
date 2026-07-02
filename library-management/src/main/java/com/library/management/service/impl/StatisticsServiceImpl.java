package com.library.management.service.impl;

import com.library.management.dto.statistics.LateRateDTO;
import com.library.management.dto.statistics.MonthlyBorrowingDTO;
import com.library.management.dto.statistics.TopAuthorDTO;
import com.library.management.entity.BorrowStatus;
import com.library.management.repository.BorrowingRepository;
import com.library.management.service.StatisticsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Implementation of {@link StatisticsService}.
 */
@Service
@Transactional(readOnly = true)
public class StatisticsServiceImpl implements StatisticsService {

    private final BorrowingRepository borrowingRepository;

    // Constructor injection (no field injection)
    public StatisticsServiceImpl(BorrowingRepository borrowingRepository) {
        this.borrowingRepository = borrowingRepository;
    }

    @Override
    public List<MonthlyBorrowingDTO> getBorrowingsPerMonth() {
        List<Object[]> rows = borrowingRepository.countBorrowingsPerMonth();
        return rows.stream()
                .map(row -> {
                    int year = ((Number) row[0]).intValue();
                    int month = ((Number) row[1]).intValue();
                    long count = ((Number) row[2]).longValue();
                    String label = String.format("%04d-%02d", year, month);
                    return MonthlyBorrowingDTO.builder()
                            .month(label)
                            .numberOfBorrowings(count)
                            .build();
                })
                .toList();
    }

    @Override
    public List<TopAuthorDTO> getTopAuthors() {
        List<Object[]> rows = borrowingRepository.countBorrowingsPerAuthor();
        return rows.stream()
                .map(row -> TopAuthorDTO.builder()
                        .authorId(((Number) row[0]).longValue())
                        .authorName((String) row[1])
                        .numberOfBorrowings(((Number) row[2]).longValue())
                        .build())
                .toList();
    }

    @Override
    @Transactional
    public LateRateDTO getLateRate() {
        // Ensure statuses are up to date before computing the rate
        borrowingRepository.markOverdueBorrowingsAsLate(LocalDate.now());

        long total = borrowingRepository.count();
        long late = borrowingRepository.countByStatut(BorrowStatus.EN_RETARD);
        double rate = total == 0 ? 0.0 : (late * 100.0) / total;

        return LateRateDTO.builder()
                .totalBorrowings(total)
                .lateBorrowings(late)
                .lateRate(Math.round(rate * 100.0) / 100.0) // rounded to 2 decimals
                .build();
    }
}
