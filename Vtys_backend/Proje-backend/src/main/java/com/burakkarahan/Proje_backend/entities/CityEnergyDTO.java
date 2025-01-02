package com.burakkarahan.Proje_backend.entities;

import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CityEnergyDTO {
    public Integer id;
    public String name;
    public double windEnergy;
    public double solarEnergy;
    public double hydroEnergy;
}

