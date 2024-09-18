import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Documents({ documents, setDocuments }) {
    const getDocs = async () => {
        try {
            const res = await fetch(import.meta.env.VITE_BACKENDURL);

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong!');
            }

            setDocuments(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getDocs();
    }, []);

    async function handleDelete(id) {
        const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/${id}`, {
            method: 'DELETE',
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Something went wrong!');
        }

        setDocuments(documents.filter((doc) => doc._id !== id));
    }

    return (
        <div>
            {documents.map((document) => {
                return (
                    <div key={document._id} className='bg-slate-300 my-5'>
                        <Link to={document._id}>
                            <h1>{document.title}</h1>
                            <p>{document.content}</p>
                        </Link>
                        <button
                            className='border'
                            onClick={() => handleDelete(document._id)}>
                            Delete
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
