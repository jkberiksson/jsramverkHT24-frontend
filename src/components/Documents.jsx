import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'react-feather';

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

    const handleDelete = async (id) => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKENDURL}/${id}`,
                {
                    method: 'DELETE',
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong!');
            }

            setDocuments(documents.filter((doc) => doc._id !== id));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getDocs();
    }, []);

    return (
        <div>
            {documents.map((document) => {
                return (
                    <div key={document._id} className='bg-slate-300 my-5'>
                        <Link to={document._id}>
                            <h1>{document.title}</h1>
                            <p>{document.content}</p>
                        </Link>
                        <button onClick={() => handleDelete(document._id)}>
                            <Trash2 color='red' />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
