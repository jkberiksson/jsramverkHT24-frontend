import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Edit } from 'react-feather';

export default function Documents({ documents, setDocuments }) {
    const getDocs = async () => {
        try {
            const res = await fetch(import.meta.env.VITE_BACKENDURL);

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong!');
            }

            data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

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

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    useEffect(() => {
        getDocs();
    }, []);

    return (
        <div>
            {documents.map((document) => {
                return (
                    <div
                        key={document._id}
                        className='border border-gray-200 shadow-md rounded-lg my-5 p-6 flex justify-between items-center gap-12'>
                        <div className='flex flex-col gap-2'>
                            <h1 className='text-base md:text-lg lg:text-xl font-bold mb-2'>
                                {document.title}
                            </h1>
                            <p className='text-gray-700'>
                                {document.content.length > 50
                                    ? `${document.content.slice(0, 120)}...`
                                    : document.content}
                            </p>
                            <p className='text-gray-500 text-xs sm:text-sm mt-2'>
                                Updated at: {formatDate(document.updatedAt)}
                            </p>
                        </div>
                        <div className='flex gap-4'>
                            <Link to={`/${document._id}`} className='text-blue-600'>
                                <Edit size={24} />
                            </Link>
                            <button
                                className='text-red-600'
                                onClick={() => handleDelete(document._id)}>
                                <Trash2 size={24} />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
