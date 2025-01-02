package com.burakkarahan.Proje_backend.controller;

import java.util.List;

import com.burakkarahan.Proje_backend.entities.CityEnergyDTO;
import com.burakkarahan.Proje_backend.entities.GunesEnerjisi;
import com.burakkarahan.Proje_backend.entities.HidroelektrikEnerjisi;
import com.burakkarahan.Proje_backend.entities.RuzgarEnerjisi;

public interface IEnergyController {
    
    public List<GunesEnerjisi> getAllGunesEnerjisi();

    public List<HidroelektrikEnerjisi> getAllHidroelektrikEnerjisi();

    public List<RuzgarEnerjisi> getAllRuzgarEnerjisi();

    public List<CityEnergyDTO> getCityEnergyData();

}
