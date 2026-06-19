package com.flexoffice.flexoffice.repository;

import com.flexoffice.flexoffice.entity.Desk;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeskRepository extends JpaRepository<Desk, Long> {
    List<Desk> findByIsActiveTrue();
}
