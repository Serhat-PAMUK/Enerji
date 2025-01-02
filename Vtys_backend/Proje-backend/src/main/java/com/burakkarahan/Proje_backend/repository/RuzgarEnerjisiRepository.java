package com.burakkarahan.Proje_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.burakkarahan.Proje_backend.entities.RuzgarEnerjisi;

@Repository
public interface  RuzgarEnerjisiRepository extends JpaRepository<RuzgarEnerjisi, Integer>{
    
}
