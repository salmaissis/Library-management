package com.library.management.service;

import com.library.management.dto.statistics.LateRateDTO;
import com.library.management.dto.statistics.MonthlyBorrowingDTO;
import com.library.management.dto.statistics.TopAuthorDTO;

import java.util.List;

/**
 * Business operations for statistics/reporting.
 */
public interface StatisticsService {

    List<MonthlyBorrowingDTO> getBorrowingsPerMonth();

    List<TopAuthorDTO> getTopAuthors();

    LateRateDTO getLateRate();
}
