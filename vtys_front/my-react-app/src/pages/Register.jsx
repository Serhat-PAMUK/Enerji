import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { auth, db } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import '../styles.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      // 1. Firebase ile kullanıcı oluştur
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // 2. E-posta doğrulama gönder
      await sendEmailVerification(userCredential.user);

      // E-posta doğrulama durumunu dinle
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user && user.emailVerified) {
          // 3. E-posta doğrulandıysa Firestore'a kaydet
          try {
            await setDoc(doc(db, "users", user.uid), {
              fullName: formData.fullName,
              email: formData.email,
              createdAt: new Date(),
              emailVerified: true
            });
          } catch (error) {
            console.error("Firestore kayıt hatası:", error);
          }
          unsubscribe(); // Dinlemeyi durdur
        }
      });

      // 4. Kullanıcıyı otomatik olarak çıkış yaptır
      await signOut(auth);

      setMessage('Kayıt başarılı! Ana sayfaya yönlendiriliyorsunuz...');
      
      // 5. Formu temizle
      setFormData({ fullName: '', email: '', password: '' });

      // 6. 2 saniye sonra ana sayfaya yönlendir
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Bu e-posta adresi zaten kullanımda.');
          break;
        case 'auth/invalid-email':
          setError('Geçersiz e-posta adresi.');
          break;
        case 'auth/operation-not-allowed':
          setError('E-posta/şifre girişi etkin değil.');
          break;
        case 'auth/weak-password':
          setError('Şifre çok zayıf.');
          break;
        default:
          setError('Kayıt olurken bir hata oluştu.');
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">Kayıt Ol</h2>
        
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Ad Soyad" 
            className="auth-input" 
            required
          />
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="E-posta" 
            className="auth-input" 
            required
          />
          <div className="password-input-container">
            <input 
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Şifre" 
              className="auth-input"
              required
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
            </button>
          </div>
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register; 
