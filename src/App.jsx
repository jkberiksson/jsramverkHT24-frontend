import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import OneDoc from './pages/OneDoc';
import Header from './components/Header';

export default function App() {
    const [documents, setDocuments] = useState([]);
    return (
        <div>
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
                <Route path='/:id' element={<OneDoc />} />
            </Routes>
        </div>
    );
}
