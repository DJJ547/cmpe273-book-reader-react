package com.example.bookbackend.controller;

import com.example.bookbackend.model.Book;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
public class BookController {

    // In-memory storage for books
    private List<Book> books = new ArrayList<>();

    // Constructor to add some initial books
    public BookController() {
        books.add(new Book("1", "Sample Book 1", "Author 1", 200));
        books.add(new Book("2", "Sample Book 2", "Author 2", 150));
    }

    // GET all books from in-memory storage
    @GetMapping
    public List<Book> getBooks() {
        return books;
    }

    // POST a new book to in-memory storage
    @PostMapping
    public Book createBook(@RequestBody Book newBook) {
        newBook.setId(String.valueOf(books.size() + 1)); // Simple ID generation
        books.add(newBook);
        return newBook;
    }

    // GET a single book by ID from in-memory storage
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable String id) {
        Optional<Book> book = books.stream().filter(b -> b.getId().equals(id)).findFirst();
        return book.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE a book by ID from in-memory storage
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable String id) {
        boolean removed = books.removeIf(book -> book.getId().equals(id));
        if (removed) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
