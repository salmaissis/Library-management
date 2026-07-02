package com.library.management.controller;

import com.library.management.dto.statistics.LateRateDTO;
import com.library.management.dto.statistics.MonthlyBorrowingDTO;
import com.library.management.dto.statistics.TopAuthorDTO;
import com.library.management.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller dedicated to reporting / statistics endpoints.
 */
@RestController
@RequestMapping("/api/statistics")
@Tag(name = "Statistics", description = "Statistiques sur les emprunts")
public class StatisticsController {

    private final StatisticsService statisticsService;

    // Constructor injection (no field injection)
    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @Operation(summary = "Emprunts par mois", description = "Retourne le nombre d'emprunts groupes par mois")
    @GetMapping("/borrowings-per-month")
    public ResponseEntity<List<MonthlyBorrowingDTO>> getBorrowingsPerMonth() {
        return ResponseEntity.ok(statisticsService.getBorrowingsPerMonth());
    }

    @Operation(summary = "Top auteurs", description = "Retourne les auteurs classes par nombre d'emprunts decroissant")
    @GetMapping("/top-authors")
    public ResponseEntity<List<TopAuthorDTO>> getTopAuthors() {
        return ResponseEntity.ok(statisticsService.getTopAuthors());
    }

    @Operation(summary = "Taux de retard", description = "Retourne le nombre total d'emprunts, le nombre d'emprunts en retard, et le taux de retard en %")
    @GetMapping("/late-rate")
    public ResponseEntity<LateRateDTO> getLateRate() {
        return ResponseEntity.ok(statisticsService.getLateRate());
    }
}
