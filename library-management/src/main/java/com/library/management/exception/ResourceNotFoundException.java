package com.library.management.exception;

/**
 * Thrown when a requested resource (Author, Book, Borrowing) does not exist.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
