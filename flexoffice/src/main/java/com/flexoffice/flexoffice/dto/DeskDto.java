package com.flexoffice.flexoffice.dto;

import lombok.Data;

@Data
public class DeskDto {
    private Long id;
    private String deskCode;
    private String location;
    private boolean isActive;
}
