package com.library.management.exception;

/**
 * Thrown when trying to borrow a book that is currently unavailable.
 */
public class BookNotAvailableException extends RuntimeException {

    public BookNotAvailableException(String message) {
        super(message);
    }
}
