package com.burakkarahan.Proje_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.burakkarahan.Proje_backend.entities.HidroelektrikEnerjisi;

@Repository
public interface HidroelektrikEnerjisiRepository extends JpaRepository<HidroelektrikEnerjisi,Integer>{
    
}
