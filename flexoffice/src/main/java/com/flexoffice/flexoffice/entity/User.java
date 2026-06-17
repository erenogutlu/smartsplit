package com.flexoffice.flexoffice.entity;

import jakarta.persistence.*;

@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)


    private String userName;
    private String password;
    private String firstName;
    private String lastName;
    private String email;

    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
    public String getPassword() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
}
