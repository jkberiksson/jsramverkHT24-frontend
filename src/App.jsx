import { useState } from 'react';

import CreateDocument from './components/CreateDocument';
import Documents from './components/Documents';
import Header from './components/Header';

export default function App() {
    const [documents, setDocuments] = useState([]);
    return (
        <div>
            <Header />
            <CreateDocument documents={documents} setDocuments={setDocuments} />
            <Documents documents={documents} setDocuments={setDocuments} />
        </div>
    );
}
