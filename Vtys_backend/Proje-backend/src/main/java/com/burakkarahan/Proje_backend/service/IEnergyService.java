package com.burakkarahan.Proje_backend.service;

import java.util.List;

import com.burakkarahan.Proje_backend.entities.CityEnergyDTO;
import com.burakkarahan.Proje_backend.entities.GunesEnerjisi;
import com.burakkarahan.Proje_backend.entities.HidroelektrikEnerjisi;
import com.burakkarahan.Proje_backend.entities.RuzgarEnerjisi;

public interface IEnergyService {
    
    List<CityEnergyDTO> getCityEnergyData();

    public List<GunesEnerjisi> getAllGunesEnerjisi();

    public List<HidroelektrikEnerjisi> getAllHidroelektrikEnerjisi();

    public List<RuzgarEnerjisi> getAllRuzgarEnerjisi();

}
