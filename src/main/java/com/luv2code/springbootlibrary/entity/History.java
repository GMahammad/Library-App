package com.luv2code.springbootlibrary.entity;

import lombok.Data;

import javax.persistence.*;

@Table(name = "history")
@Entity
@Data
public class History {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "checkout_date")
    private String checkoutDate;

    @Column(name = "returned_date")
    private String returnedDate;

    @Column(name = "img")
    private String img;

    @Column(name = "author")
    private String author;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    public History() {
    }

    public History(String userEmail, String checkoutDate, String returnedDate, String img, String author, String title, String description) {
        this.userEmail = userEmail;
        this.checkoutDate = checkoutDate;
        this.returnedDate = returnedDate;
        this.img = img;
        this.author = author;
        this.title = title;
        this.description = description;
    }
}
