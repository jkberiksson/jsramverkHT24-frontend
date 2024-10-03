import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import OneDoc from './pages/OneDoc';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';

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
        <div className='mx-auto max-w-screen-lg px-3 text-xs md:text-sm lg:text-base font-poppins'>
            <Header />
            <Routes>
                <Route
                    path='/'
                    element={
                        <Home
                            documents={documents}
                            setDocuments={setDocuments}
                        />
                    }
                />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/:id' element={<OneDoc />} />
            </Routes>
        </div>
    );
}
