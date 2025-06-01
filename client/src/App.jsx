import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Canvas from './canvas';
import Customizer from './pages/Customizer';
import Home from './pages/Home';
import SavedDesigns from './pages/SavedDesigns';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/saved-designs" element={<SavedDesigns />} />
          <Route path="/" element={
            <main className="app transition-all ease-in">
              <Home />
              <Canvas />
              <Customizer />
            </main>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
