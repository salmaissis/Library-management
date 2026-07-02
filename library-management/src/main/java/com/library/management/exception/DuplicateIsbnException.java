package com.library.management.exception;

/**
 * Thrown when trying to create/update a Book with an ISBN that already exists.
 */
public class DuplicateIsbnException extends RuntimeException {

    public DuplicateIsbnException(String message) {
        super(message);
    }
}
