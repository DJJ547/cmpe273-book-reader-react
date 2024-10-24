package com.example.bookbackend.repository;

import com.example.bookbackend.model.Book;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BookRepository extends MongoRepository<Book, String> {
    // Custom query methods can be added here
}
