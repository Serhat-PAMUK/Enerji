package com.burakkarahan.Proje_backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ruzgar_enerjisi")
@Data
@AllArgsConstructor
@NoArgsConstructor

 public class RuzgarEnerjisi {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "il", nullable = false)
    private String il;

    @Column(name = "kurulu_guc", nullable = false)
    private Float kuruluGuc;
    
}