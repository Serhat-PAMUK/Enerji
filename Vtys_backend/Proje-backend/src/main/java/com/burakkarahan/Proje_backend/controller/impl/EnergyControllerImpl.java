package com.burakkarahan.Proje_backend.controller.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.burakkarahan.Proje_backend.controller.IEnergyController;
import com.burakkarahan.Proje_backend.entities.CityEnergyDTO;
import com.burakkarahan.Proje_backend.entities.GunesEnerjisi;
import com.burakkarahan.Proje_backend.entities.HidroelektrikEnerjisi;
import com.burakkarahan.Proje_backend.entities.RuzgarEnerjisi;
import com.burakkarahan.Proje_backend.service.IEnergyService;

@RestController
@RequestMapping("energy/api")
public class EnergyControllerImpl implements IEnergyController {

    @Autowired
    private IEnergyService energyService;

    @Override
    @GetMapping(path = "/gunes")
    public List<GunesEnerjisi> getAllGunesEnerjisi() {
        return energyService.getAllGunesEnerjisi();
    }

    @Override
    @GetMapping(path = "/hidroelektrik")
    public List<HidroelektrikEnerjisi> getAllHidroelektrikEnerjisi() {
        return energyService.getAllHidroelektrikEnerjisi();
    }

    @Override
    @GetMapping(path = "/ruzgar")
    public List<RuzgarEnerjisi> getAllRuzgarEnerjisi() {
        return energyService.getAllRuzgarEnerjisi();
    }

    @GetMapping(path = "/sehirler")
    public List<CityEnergyDTO> getCityEnergyData() {
        return energyService.getCityEnergyData();
    }

}
