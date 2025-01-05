import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { fetchEnergyData, setSelectedEnergyType } from '../store/slices/energySlice'
import TurkeyMap from '../components/TurkeyMap'
import '../App.css'
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, addDoc, getDocs, query, orderBy, serverTimestamp, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { commentService } from '../services/CommentService';


function Home () {

    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const [editText, setEditText] = useState('');

    const navigate = useNavigate();

    const kayitButtonClick = () => {
      navigate("/register"); // "register" sayfasına yönlendir
    };

    const girisButtonClick = () => {
      navigate("/login"); // "login" sayfasına yönlendirir
    }

    const dispatch = useDispatch()
    const { energyData, selectedEnergyType, loading, error } = useSelector((state) => state.energy)
    const [activeMap, setActiveMap] = useState('gunes')
    const [hoveredCity, setHoveredCity] = useState(null)
  
    const energyTypes = [
      { id: 'gunes', name: 'Güneş Enerjisi', color: '#ff5900', colorRGB: '255, 144, 0' },
      { id: 'ruzgar', name: 'Rüzgar Enerjisi', color: '#06b700', colorRGB: '56, 255, 0' },
      { id: 'hidroelektrik', name: 'Hidroelektrik', color: '#003b99', colorRGB: '0, 74, 255' },
    ]
  
    useEffect(() => {
      dispatch(fetchEnergyData(selectedEnergyType));
      setActiveMap(selectedEnergyType);
    }, [selectedEnergyType, dispatch]);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          // Kullanıcı bilgilerini Firestore'dan al
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } else {
          setUserData(null);
        }
      });
      return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Çıkış yapılırken hata oluştu:', error);
      }
    };
  
    const handleEnergyTypeChange = (energyType) => {
      dispatch(setSelectedEnergyType(energyType));
    }
  
    const handleCityHover = (cityName) => {
      setHoveredCity(cityName);
    }
  
    const handleCityClick = (cityName) => {
      console.log(`${cityName} seçildi`);
    }
  
    const currentType = energyTypes.find(type => type.id === activeMap);
  
    const getCityData = (cityName) => {
      return energyData?.find(item => item.il.toLowerCase() === cityName.toLowerCase());
    };
  
    // Yorumları getir
    const fetchComments = async () => {
      try {
        const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const commentsData = [];
        querySnapshot.forEach((doc) => {
          commentsData.push({ id: doc.id, ...doc.data() });
        });
        setComments(commentsData);
      } catch (error) {
        console.error("Yorumlar yüklenirken hata:", error);
      }
    };

    // Sayfa yüklendiğinde yorumları getir
    useEffect(() => {
      fetchComments();
    }, []);

    // Yorum ekleme fonksiyonu
    const handleAddComment = async (e) => {
      e.preventDefault();
      if (!newComment.trim()) return;

      setIsSubmitting(true);
      try {
        await commentService.addComment(newComment, {
          uid: user.uid,
          fullName: userData?.fullName,
          email: user.email
        });
        setNewComment('');
        fetchComments();
      } catch (error) {
        console.error("Yorum eklenirken hata:", error.message);
      } finally {
        setIsSubmitting(false);
      }
    };

    // Yorum silme fonksiyonu
    const handleDeleteComment = async (commentId) => {
      if (window.confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
        try {
          await commentService.deleteComment(commentId, user.uid);
          fetchComments();
        } catch (error) {
          console.error("Yorum silinirken hata:", error.message);
        }
      }
    };

    // Yorum düzenleme modunu aç
    const handleEditStart = (comment) => {
      setEditingComment(comment.id);
      setEditText(comment.text);
    };

    // Yorum güncelleme fonksiyonu
    const handleUpdateComment = async (commentId) => {
      try {
        await commentService.updateComment(commentId, editText, user.uid);
        setEditingComment(null);
        fetchComments();
      } catch (error) {
        console.error("Yorum güncellenirken hata:", error.message);
      }
    };

    return (
      <div className="container">
        <div className="auth-buttons">
           {user ? (
            <div className="user-info">
              <span className="user-name">{userData?.fullName || user.email}</span>
              <button onClick={handleLogout} className="logout-btn">Çıkış</button>
            </div>
          ) : (
            <>
              <button className="auth-button" onClick={kayitButtonClick}>KAYIT OL</button>
              <button className="auth-button" onClick={girisButtonClick}>GİRİŞ YAP</button>
            </>
          )}
        </div>
        <h1 className='h1'>Türkiye Yenilenebilir Enerji Analizi</h1>
        <div className="energy-buttons">
          {energyTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleEnergyTypeChange(type.id)}
              className={`energy-button ${selectedEnergyType === type.id ? 'active' : ''}`}
              style={{
                '--button-color': type.color,
                '--button-hover-color': type.color + 'dd',
                '--energy-color-rgb': type.colorRGB
              }}
            >
              {type.name}
            </button>
          ))}
          <button
            className="energy-button grafik-button"
            onClick={() => navigate('/grafik')}
            style={{ '--button-color': '#6366f1', '--button-hover-color': '#4f46e5' }}
          >
            Grafik
          </button>
          <button
            className="energy-button haber-button"
            onClick={() => navigate('/haberler')}
            style={{ '--button-color': '#10b981', '--button-hover-color': '#059669' }}
          >
            Haberler
          </button>
        </div>
  
        {loading && <div className="loading">Yükleniyor...</div>}
        {error && <div className="error">Hata: {error}</div>}
        
        <div className="map-container" style={{ '--energy-color-rgb': currentType?.colorRGB }}>
          <TurkeyMap
            data={energyData || []}
            onHover={handleCityHover}
            onClick={handleCityClick}
          />
  
          {hoveredCity && (
            <div className="city-info">
              <h3>{hoveredCity}</h3>
              <p>
                Kurulu Güç: {getCityData(hoveredCity)?.kuruluGuc?.toFixed(2) || '0'} MW
              </p>
            </div>
          )}
  
          <div className="legend">
            <h4>{currentType?.name} Kapasitesi</h4>
            <div className="legend-scale">
              <div>0 MW</div>
              <div>200 MW</div>
              <div>400 MW</div>
            </div>
          </div>
        </div>
  
        <div className="data-container">
          <h2>Şehir Verileri</h2>
          <table className="city-table">
            <thead>
              <tr>
                <th>Şehir</th>
                <th>Kurulu Güç (MW)</th>
              </tr>
            </thead>
            <tbody>
              {energyData?.map((city) => (
                <tr key={city.il}>
                  <td>{city.il}</td>
                  <td>{city.kuruluGuc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="comments-section">
          <h2>Yorumlar</h2>
          
          {user ? (
            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Yorumunuzu yazın..."
                className="comment-input"
                required
              />
              <button 
                type="submit" 
                className="comment-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Gönderiliyor...' : 'Yorum Yap'}
              </button>
            </form>
          ) : (
            <p className="login-prompt">
              Yorum yapmak için lütfen <Link to="/login">giriş yapın</Link>
            </p>
          )}

          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">{comment.userName}</span>
                  <span className="comment-date">
                    {comment.createdAt?.toDate().toLocaleDateString('tr-TR')}
                  </span>
                </div>
                
                {editingComment === comment.id ? (
                  <div className="comment-edit-form">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="comment-edit-input"
                    />
                    <div className="comment-edit-buttons">
                      <button 
                        onClick={() => handleUpdateComment(comment.id)}
                        className="comment-edit-btn"
                      >
                        Kaydet
                      </button>
                      <button 
                        onClick={() => setEditingComment(null)}
                        className="comment-cancel-btn"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="comment-text">{comment.text}</p>
                    {user && user.uid === comment.userId && (
                      <div className="comment-actions">
                        <button 
                          onClick={() => handleEditStart(comment)}
                          className="comment-action-btn edit"
                        >
                          Düzenle
                        </button>
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          className="comment-action-btn delete"
                        >
                          Sil
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
};

export default Home;