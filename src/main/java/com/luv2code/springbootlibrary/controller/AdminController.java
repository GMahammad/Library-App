package com.luv2code.springbootlibrary.controller;


import com.luv2code.springbootlibrary.entity.Book;
import com.luv2code.springbootlibrary.requestmodels.AdminBookRequest;
import com.luv2code.springbootlibrary.service.AdminService;
import com.luv2code.springbootlibrary.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/secure/create/book")
    public void createNewBook(@RequestHeader(value = "Authorization") String token, @RequestBody AdminBookRequest adminBookRequest) throws Exception{
        String adminRole = ExtractJWT.payloadJWTExtraction(token,"\"userType\"");
        if(adminRole ==null && !adminRole.equals("admin")){
            throw new Exception("Administration page only!");
        }
        adminService.createNewBook(adminBookRequest);

    }

    @PutMapping("/secure/quantity/decrease")
    public void decreaseQuantityOfBook(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId) throws Exception{
        String adminRole = ExtractJWT.payloadJWTExtraction(token,"\"userType\"");
        if(adminRole ==null && !adminRole.equals("admin")){
            throw new Exception("Administration page only!");
        }
        adminService.decreaseQuantity(bookId);
    }

    @PutMapping("/secure/quantity/increase")
    public void increaseQuantityOfBook(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId) throws Exception{
        String adminRole = ExtractJWT.payloadJWTExtraction(token,"\"userType\"");
        if(adminRole == null && !adminRole.equals("admin")){
            throw new Exception("Administration page only!");
        }
        adminService.increaseQuantity(bookId);
    }

    @DeleteMapping("/secure/delete")
    public void deleteBook(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId) throws Exception {
        String adminRole = ExtractJWT.payloadJWTExtraction(token,"\"userType\"");
        if(adminRole == null || !adminRole.equals("admin")){
            throw new Exception("Administration page only");
        }
        adminService.deleteBook(bookId);
    }


}
