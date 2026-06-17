package com.flexoffice.flexoffice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tables")
public class Desk {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    private String location;
    private String active;


}
