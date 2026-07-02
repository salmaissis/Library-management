package com.library.management.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing an author ranked by number of borrowings.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopAuthorDTO {

    private Long authorId;
    private String authorName;
    private long numberOfBorrowings;
}
