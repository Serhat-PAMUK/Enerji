import './App.css'
import { Routes , Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login';  // Login bileşenini import edin
import Register from './pages/Register';  // Register bileşenini import edin
import Grafik from './pages/Grafik';
import Haberler from './pages/Haberler';


function App() {
  return(
    <div>
      <Routes>
        <Route path='/' element={(<Home/>)}/>
        <Route path='/login' element={(<Login/>)}/>
        <Route path='/register' element={(<Register/>)}/>
        <Route path="/grafik" element={<Grafik />} />
        <Route path="/haberler" element={<Haberler />} />
      </Routes>
    </div>
  )
}

export default App 