import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const Grafik = () => {
  const [activeEnergy, setActiveEnergy] = useState('solar');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [cityData, setCityData] = useState([]);

  const regions = {
    'Marmara Bölgesi': ['İstanbul', 'Edirne', 'Kırklareli', 'Tekirdağ', 'Çanakkale', 'Kocaeli', 'Yalova', 'Sakarya', 'Bilecik', 'Bursa', 'Balıkesir'],
    'Ege Bölgesi': ['İzmir', 'Manisa', 'Aydın', 'Denizli', 'Muğla', 'Afyonkarahisar', 'Kütahya', 'Uşak'],
    'Akdeniz Bölgesi': ['Antalya', 'Isparta', 'Burdur', 'Mersin', 'Adana', 'Osmaniye', 'Hatay', 'Kahramanmaraş'],
    'İç Anadolu Bölgesi': ['Ankara', 'Konya', 'Karaman', 'Kırıkkale', 'Kırşehir', 'Nevşehir', 'Aksaray', 'Niğde', 'Eskişehir', 'Çankırı', 'Yozgat', 'Sivas', 'Kayseri'],
    'Karadeniz Bölgesi': ['Bolu', 'Düzce', 'Zonguldak', 'Karabük', 'Bartın', 'Kastamonu', 'Çorum', 'Sinop', 'Samsun', 'Amasya', 'Tokat', 'Ordu', 'Giresun', 'Gümüşhane', 'Trabzon', 'Bayburt', 'Rize', 'Artvin'],
    'Doğu Anadolu Bölgesi': ['Erzincan', 'Erzurum', 'Kars', 'Ardahan', 'Ağrı', 'Iğdır', 'Van', 'Muş', 'Bitlis', 'Hakkari', 'Tunceli', 'Bingöl', 'Elazığ', 'Malatya'],
    'Güneydoğu Anadolu Bölgesi': ['Gaziantep', 'Kilis', 'Adıyaman', 'Şanlıurfa', 'Diyarbakır', 'Mardin', 'Batman', 'Siirt', 'Şırnak']
  };

  useEffect(() => {
    fetchCityData();
  }, []);

  useEffect(() => {
    if (cityData.length > 0) {
      updateChartData(activeEnergy);
    }
  }, [activeEnergy, cityData]);

  const fetchCityData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/energy/api/sehirler');
      setCityData(response.data);
    } catch (error) {
      console.error('API\'den veri çekilirken hata:', error);
    }
  };

  const calculateRegionEnergy = (regionCities, energyType) => {
    let total = 0;
    regionCities.forEach(city => {
      const cityInfo = cityData.find(c => c.name === city);
      if (cityInfo) {
        switch(energyType) {
          case 'wind':
            total += parseFloat(cityInfo.windEnergy || 0);
            break;
          case 'solar':
            total += parseFloat(cityInfo.solarEnergy || 0);
            break;
          case 'hydro':
            total += parseFloat(cityInfo.hydroEnergy || 0);
            break;
          default:
            break;
        }
      }
    });
    return total;
  };

  const getEnergyColor = (energyType) => {
    switch(energyType) {
      case 'wind':
        return {
          background: 'rgba(53, 162, 235, 0.5)',
          border: 'rgba(53, 162, 235, 1)'
        };
      case 'solar':
        return {
          background: 'rgba(255, 206, 86, 0.5)',
          border: 'rgba(255, 206, 86, 1)'
        };
      case 'hydro':
        return {
          background: 'rgba(75, 192, 192, 0.5)',
          border: 'rgba(75, 192, 192, 1)'
        };
      default:
        return {
          background: 'rgba(201, 203, 207, 0.5)',
          border: 'rgba(201, 203, 207, 1)'
        };
    }
  };

  const getEnergyLabel = (energyType) => {
    switch(energyType) {
      case 'wind':
        return 'Rüzgar';
      case 'solar':
        return 'Güneş';
      case 'hydro':
        return 'Hidroelektrik';
      default:
        return '';
    }
  };

  const updateChartData = (energyType) => {
    const regionNames = Object.keys(regions);
    const colors = getEnergyColor(energyType);
    
    const data = {
      labels: regionNames,
      datasets: [
        {
          label: `${getEnergyLabel(energyType)} Enerjisi Üretimi (MW)`,
          data: regionNames.map(region => 
            calculateRegionEnergy(regions[region], energyType)
          ),
          backgroundColor: colors.background,
          borderColor: colors.border,
          borderWidth: 1,
        },
      ],
    };
    setChartData(data);
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Bölgelere Göre Yenilenebilir Enerji Üretimi',
        color: 'black',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Enerji Üretimi (MW)',
          color: 'black'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Bölgeler',
          color: 'black'
        }
      }
    },
  };

  return (
    <div className="container">
      <h1 style={{ color: 'white' }}>Bölgesel Enerji Üretim Grafiği</h1>
      
      <div className="energy-buttons">
        <button
          className={`energy-button ${activeEnergy === 'wind' ? 'active' : ''}`}
          onClick={() => setActiveEnergy('wind')}
          style={{ '--button-color': '#3b82f6', '--button-hover-color': '#2563eb' }}
        >
          Rüzgar
        </button>
        <button
          className={`energy-button ${activeEnergy === 'solar' ? 'active' : ''}`}
          onClick={() => setActiveEnergy('solar')}
          style={{ '--button-color': '#f59e0b', '--button-hover-color': '#d97706' }}
        >
          Güneş
        </button>
        <button
          className={`energy-button ${activeEnergy === 'hydro' ? 'active' : ''}`}
          onClick={() => setActiveEnergy('hydro')}
          style={{ '--button-color': '#14b8a6', '--button-hover-color': '#0d9488' }}
        >
          Hidroelektrik
        </button>
      </div>

      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Grafik; 
