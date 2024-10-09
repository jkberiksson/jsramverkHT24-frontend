import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function Document({ setDocuments }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [document, setDocument] = useState({});
    const params = useParams();
    const navigate = useNavigate();
    const id = params.id;

    useEffect(() => {
        const getDoc = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/documents/${id}`, {
                    headers: {
                        'x-access-token': JSON.parse(localStorage.getItem('token')),
                    },
                });

                if (res.status === 401) {
                    localStorage.clear();
                    setDocuments([]);
                    navigate('/login');
                }

                const data = await res.json();

                if (data.message === 'No document found with the provided ID') {
                    navigate('/error');
                }

                if (!res.ok) {
                    throw new Error(data.message || 'An error occurred. Please try again.');
                }

                setDocument(data);
                setTitle(data.title);
                setContent(data.content);
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        getDoc();
    }, [id]);

    async function handleSubmit(event) {
        event.preventDefault();
        setErrorMessage(null);
        setIsSubmitting(true);

        const dataToSubmit = {
            title,
            content,
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/documents/${id}`, {
                method: 'PUT',
                body: JSON.stringify(dataToSubmit),
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': JSON.parse(localStorage.getItem('token')),
                },
            });

            if (res.status === 401) {
                localStorage.clear();
                setDocuments([]);
                navigate('/login');
            }

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'An error occurred. Please try again.');
            }

            alert('Document updated');
            setDocument(data);
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    function formatDate(isoDate) {
        const date = new Date(isoDate);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }

    if (isLoading) {
        return (
            <div className='flex items-center justify-center my-4'>
                <div className='animate-spin rounded-full border-4 border-blue-600 border-t-transparent w-16 h-16'></div>
            </div>
        );
    }

    return (
        <form className='py-6 border-b border-gray-800' onSubmit={handleSubmit}>
            <h2 className='text-xl font-medium mb-4'>Edit Document</h2>
            {errorMessage && <div className='text-red-500 my-4'>{errorMessage}</div>}
            <label htmlFor='title' className='block text-lg mb-1'>
                Title
            </label>
            <input
                className='w-full mb-4 px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none'
                type='text'
                name='title'
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <label htmlFor='content' className='block text-lg mb-1'>
                Content
            </label>
            <textarea
                className='w-full mb-4 px-4 py-2 border h-52 border-gray-600 bg-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none'
                name='content'
                id='content'
                value={content}
                onChange={(e) => setContent(e.target.value)}></textarea>
            <p className='text-gray-500 text-xs sm:text-sm mt-2'>Updated at: {formatDate(document.updatedAt)}</p>
            <div className='flex items-center gap-4 mt-4'>
                <button
                    className={`px-6 py-2 border border-blue-600 bg-blue-600 hover:bg-blue-700 hover:border-blue-700 rounded-lg font-medium focus:outline-none ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    type='submit'
                    disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save'}
                </button>
                <Link className='px-6 py-2 border border-blue-700 rounded-lg focus:outline-none font-medium' to='/'>
                    Back
                </Link>
            </div>
        </form>
    );
}
