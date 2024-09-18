import CreateDocument from '../components/CreateDocument';
import Documents from '../components/Documents';

export default function Home({ documents, setDocuments }) {
    return (
        <>
            <CreateDocument documents={documents} setDocuments={setDocuments} />
            <Documents documents={documents} setDocuments={setDocuments} />
        </>
    );
}
