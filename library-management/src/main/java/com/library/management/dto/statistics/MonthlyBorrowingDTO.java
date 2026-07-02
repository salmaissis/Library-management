package com.library.management.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing the number of borrowings for a given month.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyBorrowingDTO {

    /**
     * Month label, formatted as "YYYY-MM".
     */
    private String month;

    private long numberOfBorrowings;
}
