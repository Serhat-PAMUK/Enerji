package com.burakkarahan.Proje_backend.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.burakkarahan.Proje_backend.entities.CityEnergyDTO;
import com.burakkarahan.Proje_backend.entities.GunesEnerjisi;
import com.burakkarahan.Proje_backend.entities.HidroelektrikEnerjisi;
import com.burakkarahan.Proje_backend.entities.RuzgarEnerjisi;
import com.burakkarahan.Proje_backend.repository.GunesEnerjisiRepository;
import com.burakkarahan.Proje_backend.repository.HidroelektrikEnerjisiRepository;
import com.burakkarahan.Proje_backend.repository.RuzgarEnerjisiRepository;
import com.burakkarahan.Proje_backend.service.IEnergyService;

@Service
public class EnergyServiceImpl implements IEnergyService {

    @Autowired
    private GunesEnerjisiRepository gunesEnerjisiRepository;

    @Autowired
    private HidroelektrikEnerjisiRepository hidroelektrikEnerjisiRepository;

    @Autowired
    private RuzgarEnerjisiRepository ruzgarEnerjisiRepository;

    @Override
    public List<GunesEnerjisi> getAllGunesEnerjisi() {
        List<GunesEnerjisi> gunesEnerjisiList = gunesEnerjisiRepository.findAll();
        return gunesEnerjisiList;
    }

    @Override
    public List<HidroelektrikEnerjisi> getAllHidroelektrikEnerjisi() {
        List<HidroelektrikEnerjisi> hidroelektrikEnerjisiList = hidroelektrikEnerjisiRepository.findAll();
        return hidroelektrikEnerjisiList;
    }

    @Override
    public List<RuzgarEnerjisi> getAllRuzgarEnerjisi() {
        List<RuzgarEnerjisi> ruzgarEnerjisiList = ruzgarEnerjisiRepository.findAll();
        return  ruzgarEnerjisiList;
    }

    @Override
    public List<CityEnergyDTO> getCityEnergyData() {
    List<CityEnergyDTO> cityEnergyList = new ArrayList<>();

    // Tüm enerji türlerinin verilerini çekiyoruz
    List<GunesEnerjisi> solarData = gunesEnerjisiRepository.findAll();
    List<HidroelektrikEnerjisi> hydroData = hidroelektrikEnerjisiRepository.findAll();
    List<RuzgarEnerjisi> windData = ruzgarEnerjisiRepository.findAll();

    // Şehirleri takip etmek için bir "name" (il) bazlı eşleştirme yapıyoruz
    Map<String, CityEnergyDTO> cityEnergyMap = new HashMap<>();

    // Güneş Enerjisi verilerini işliyoruz
    for (GunesEnerjisi solar : solarData) {
        String cityName = solar.getIl();

        CityEnergyDTO dto = cityEnergyMap.getOrDefault(cityName, new CityEnergyDTO());
        dto.setName(cityName);
        dto.setId(solar.getId());
        dto.setSolarEnergy(solar.getKuruluGuc());

        cityEnergyMap.put(cityName, dto);
    }

    // Hidroelektrik Enerjisi verilerini işliyoruz
    for (HidroelektrikEnerjisi hydro : hydroData) {
        String cityName = hydro.getIl();

        CityEnergyDTO dto = cityEnergyMap.getOrDefault(cityName, new CityEnergyDTO());
        dto.setName(cityName);
        dto.setId(hydro.getId()); // Eğer ID güncel olarak hidro'dan alınacaksa
        dto.setHydroEnergy(hydro.getKuruluGuc());

        cityEnergyMap.put(cityName, dto);
    }

    // Rüzgar Enerjisi verilerini işliyoruz
    for (RuzgarEnerjisi wind : windData) {
        String cityName = wind.getIl();

        CityEnergyDTO dto = cityEnergyMap.getOrDefault(cityName, new CityEnergyDTO());
        dto.setName(cityName);
        dto.setId(wind.getId()); // Eğer ID güncel olarak rüzgar'dan alınacaksa
        dto.setWindEnergy(wind.getKuruluGuc());

        cityEnergyMap.put(cityName, dto);
    }

    // Map'in değerlerini listeye çeviriyoruz
    cityEnergyList.addAll(cityEnergyMap.values());

    return cityEnergyList;
}

}