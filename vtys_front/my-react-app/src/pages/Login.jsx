import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  signOut,
  sendEmailVerification 
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        setError('Lütfen önce e-posta adresinizi doğrulayın. Doğrulama e-postası gönderildi.');
        await sendEmailVerification(userCredential.user);
        return;
      }

      setMessage('Giriş başarılı! Yönlendiriliyorsunuz...');
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Geçersiz e-posta adresi.');
          break;
        case 'auth/user-disabled':
          setError('Bu hesap devre dışı bırakılmış.');
          break;
        case 'auth/user-not-found':
          setError('Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.');
          break;
        case 'auth/wrong-password':
          setError('Hatalı şifre.');
          break;
        default:
          setError('Giriş yapılırken bir hata oluştu.');
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">Giriş Yap</h2>
        
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
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
            {loading ? 'Giriş Yapılıyor...' : 'GİRİŞ YAP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;