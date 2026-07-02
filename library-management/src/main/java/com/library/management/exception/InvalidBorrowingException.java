package com.library.management.exception;

/**
 * Thrown when a borrowing operation violates business rules
 * (e.g. invalid dates, already returned, etc.).
 */
public class InvalidBorrowingException extends RuntimeException {

    public InvalidBorrowingException(String message) {
        super(message);
    }
}
