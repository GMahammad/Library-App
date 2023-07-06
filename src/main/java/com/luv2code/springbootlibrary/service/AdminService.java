package com.luv2code.springbootlibrary.service;

import com.luv2code.springbootlibrary.dao.BookRepository;
import com.luv2code.springbootlibrary.entity.Book;
import com.luv2code.springbootlibrary.requestmodels.AdminBookRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class AdminService {
    private final BookRepository bookRepository;

    public AdminService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public void createNewBook(AdminBookRequest adminBookRequest) {
        Book book = new Book();
        book.setTitle(adminBookRequest.getTitle());
        book.setAuthor(adminBookRequest.getAuthor());
        book.setDescription(adminBookRequest.getDescription());
        book.setCopies(adminBookRequest.getCopies());
        book.setCopiesAvailable(adminBookRequest.getCopies());
        book.setCategory(adminBookRequest.getCategory());
        book.setImg(adminBookRequest.getImg());
        bookRepository.save(book);
    }

    public void decreaseQuantity(Long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);
        if (!book.isPresent() || book.get().getCopiesAvailable() <= 0 || book.get().getCopies() <= 0) {
            throw new Exception("Book could not be found or quantity locked");
        }

        book.get().setCopies(book.get().getCopies() - 1);
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        bookRepository.save(book.get());
    }

    public void increaseQuantity(Long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);
        if (!book.isPresent() || book.get().getCopies() <= 0 || book.get().getCopiesAvailable() < 0) {
            throw new Exception("Book could not be found or quantity locked");
        }

        book.get().setCopies(book.get().getCopies() + 1);
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);
        bookRepository.save(book.get());
    }

    public void deleteBook(Long bookId) throws Exception{
        Optional<Book> book = bookRepository.findById(bookId);
        if(!book.isPresent()){
            throw new Exception("Book can not be found!");
        }
        bookRepository.deleteById(book.get().getId());
    }

}
