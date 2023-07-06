package com.luv2code.springbootlibrary.entity;

import lombok.Data;

import javax.persistence.*;

@Table(name = "messages")
@Entity
@Data
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "user_email")
    private String userEmail;
    @Column(name = "admin_email")
    private String adminEmail;
    @Column(name = "closed")
    private boolean closed;
    @Column(name = "question")
    private String question;
    @Column(name = "response")
    private String response;
    @Column(name="title")
    private String title;

    public Message() {
    }

    public Message(String question, String response) {
        this.question = question;
        this.title = response;
    }
}
