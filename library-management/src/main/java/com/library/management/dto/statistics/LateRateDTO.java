package com.library.management.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing the late-return rate across all borrowings.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LateRateDTO {

    private long totalBorrowings;
    private long lateBorrowings;
    private double lateRate; // percentage, e.g. 12.5 means 12.5%
}
