import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Edit, Share } from 'react-feather';
import { useNavigate } from 'react-router-dom';

export default function Documents({ documents, setDocuments, handleShare }) {
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    async function handleDelete(id) {
        setErrorMessage(null);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKENDURL}/documents/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'x-access-token': JSON.parse(
                            localStorage.getItem('token')
                        ),
                    },
                }
            );

            if (res.status === 401) {
                localStorage.clear();
                setDocuments([]);
                navigate('/login');
            }

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || 'An error occurred. Please try again.'
                );
            }

            setDocuments(documents.filter((doc) => doc._id !== id));
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    function formatDate(isoDate) {
        const date = new Date(isoDate);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }

    useEffect(() => {
        const getDocs = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKENDURL}/documents`,
                    {
                        headers: {
                            'x-access-token': JSON.parse(
                                localStorage.getItem('token')
                            ),
                        },
                    }
                );

                if (res.status === 401) {
                    localStorage.clear();
                    setDocuments([]);
                    navigate('/login');
                }

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.message || 'An error occurred. Please try again.'
                    );
                }

                data.sort(
                    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
                );

                setDocuments(data);
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        getDocs();
    }, [setDocuments]);

    if (isLoading) {
        return (
            <div className='flex items-center justify-center my-4'>
                <div className='animate-spin rounded-full border-4 border-blue-600 border-t-transparent w-16 h-16'></div>
            </div>
        );
    }

    if (errorMessage) {
        return <div className='text-red-500 my-4'>{errorMessage}</div>;
    }

    return (
        <div>
            {documents.length === 0 ? (
                <div className='text-gray-500 my-4'>
                    Whoops, looks like you don´t have any documents. Create a
                    new one!
                </div>
            ) : (
                documents.map((document) => {
                    return (
                        <div
                            className='border-b border-gray-800 rounded-sm my-3 p-3 flex justify-between items-center gap-12'
                            key={document._id}>
                            <div>
                                <h1 className='text-base md:text-xl font-medium mb-2'>
                                    {document.title}
                                </h1>
                                <p className='text-gray-400 font-light'>
                                    {document.content.length > 120
                                        ? `${document.content.slice(0, 120)}...`
                                        : document.content}
                                </p>
                                <p className='text-gray-600 text-xs mt-5'>
                                    Updated at: {formatDate(document.updatedAt)}
                                </p>
                                <p className='text-gray-600 text-xs'>
                                    Creator: {document.creator}
                                </p>
                            </div>
                            <div className='flex gap-3'>
                                <Link
                                    className='bg-green-500 hover:bg-green-600 p-2 rounded-md'
                                    to={`/documents/${document._id}`}>
                                    <Edit size={18} />
                                </Link>

                                {document.creator ===
                                JSON.parse(localStorage.getItem('email')) ? (
                                    <button
                                        className='bg-blue-500 hover:bg-blue-600 p-2 rounded-md'
                                        onClick={() =>
                                            handleShare(document._id)
                                        }>
                                        <Share size={18} />
                                    </button>
                                ) : (
                                    ''
                                )}
                                {document.creator ===
                                JSON.parse(localStorage.getItem('email')) ? (
                                    <button
                                        className='bg-red-500 hover:bg-red-600 p-2 rounded-md'
                                        onClick={() =>
                                            handleDelete(document._id)
                                        }>
                                        <Trash2 size={18} />
                                    </button>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
