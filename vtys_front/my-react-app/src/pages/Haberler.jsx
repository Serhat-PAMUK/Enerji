import { useState, useEffect } from 'react';
import axios from 'axios';

const apiEnvKey = import.meta.env.VITE_API_KEY;

const Haberler = () => {
  const [haberler, setHaberler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(null);

  useEffect(() => {
    const haberleriGetir = async () => {
      try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
          params: {
            q: `"enerji santrali" OR 
                "elektrik üretimi" OR 
                "rüzgar enerjisi" OR 
                "güneş enerjisi" OR 
                "yenilenebilir enerji" OR 
                "enerji yatırımı" OR 
                "enerji projesi" OR 
                "enerji santralleri" OR 
                "enerji üretimi" OR 
                "enerji tesisi" OR 
                EPDK OR 
                "enerji bakanlığı"`,
            language: 'tr',
            sortBy: 'publishedAt',
            domains: 'dunya.com,bloomberght.com,enerjigunlugu.net,yenienerji.com,enerjigazetesi.ist,aa.com.tr,hurriyet.com.tr,sabah.com.tr,milliyet.com.tr,trthaber.com',
            pageSize: 50,
            apiKey: apiEnvKey
          }
        });
        
        // Daha detaylı filtreleme
        const filtrelenmisHaberler = response.data.articles.filter(haber => {
          const enerjiKeywords = [
            'enerji santrali',
            'elektrik üretimi',
            'rüzgar enerjisi',
            'güneş enerjisi',
            'hidroelektrik',
            'yenilenebilir enerji',
            'enerji yatırımı',
            'enerji projesi',
            'enerji santralleri',
            'enerji üretimi',
            'enerji tesisi',
            'epdk',
            'enerji bakanlığı',
            'megavat',
            'mw',
            'gwh'
          ];
          
          const title = haber.title?.toLowerCase() || '';
          const description = haber.description?.toLowerCase() || '';
          
          return enerjiKeywords.some(keyword => 
            title.includes(keyword.toLowerCase()) || 
            description.includes(keyword.toLowerCase())
          );
        });

        setHaberler(filtrelenmisHaberler);
        setYukleniyor(false);
      } catch (error) {
        setHata('Haberler yüklenirken bir hata oluştu');
        setYukleniyor(false);
        console.error('Hata:', error);
      }
    };

    haberleriGetir();
  }, []);

  if (yukleniyor) return <div className="loading" style={{color:'white'}}>Yükleniyor...</div>;
  if (hata) return <div className="error">{hata}</div>;

  return (
    <div className="haberler-container">
      <h1 style={{color:'white'}}>Yenilenebilir Enerji Haberleri</h1>
      <div className="haberler-grid">
        {haberler.map((haber, index) => (
          <div key={index} className="haber-card">
            {haber.urlToImage && (
              <img src={haber.urlToImage} alt={haber.title} className="haber-image" />
            )}
            <div className="haber-content">
              <h2>{haber.title}</h2>
              <p>{haber.description}</p>
              <div className="haber-meta">
                <span>{new Date(haber.publishedAt).toLocaleDateString('tr-TR')}</span>
                <a href={haber.url} target="_blank" rel="noopener noreferrer">
                  Devamını Oku
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Haberler; 