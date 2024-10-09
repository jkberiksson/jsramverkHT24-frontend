import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import OneDoc from './pages/OneDoc';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Error from './pages/Error';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!JSON.parse(token) || !JSON.parse(email)) {
      navigate('/login');
    }
  }, []);
  return (
    <div className='max-w-5xl mx-auto px-4'>
      <Header setDocuments={setDocuments} />
      <Routes>
        <Route path='/' element={<Home documents={documents} setDocuments={setDocuments} />} />
        <Route path='/documents/:id' element={<OneDoc documents={documents} />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/*' element={<Error />} />
      </Routes>
    </div>
  );
}
