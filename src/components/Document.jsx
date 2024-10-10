import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'react-feather';
import io from 'socket.io-client';

export default function Document({ setDocuments }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [docAccess, setDocAccess] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingUnshare, setIsLoadingUnshare] = useState(false);
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
                setDocAccess(data.docAccess);
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        getDoc();
    }, [id]);

    async function handleUnShare(id, email) {
        setIsLoadingUnshare(true);
        const dataToSubmit = {
            id,
            email,
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/share/unshare`, {
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

            setDocAccess(data.document.docAccess);
            setErrorMessage(null);

            if (document.creator !== JSON.parse(localStorage.getItem('email'))) {
                navigate('/');
            }
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsLoadingUnshare(false);
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
        <div>
            <form className='py-6 border-b border-gray-800'>
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
                <Link className='inline-block mt-4 px-6 py-2 border border-blue-700 rounded-lg focus:outline-none font-medium' to='/'>
                    Back
                </Link>
                {document.creator !== JSON.parse(localStorage.getItem('email')) ? (
                    <button
                        disabled={isLoadingUnshare}
                        className='mt-4 px-6 py-2 border border-red-500 hover:border-red-800 bg-red-500 hover:bg-red-800 rounded-lg font-medium ml-4'
                        onClick={() => handleUnShare(document._id, JSON.parse(localStorage.getItem('email')))}>
                        {isLoadingUnshare ? 'Unsharing' : 'Unshare from account'}
                    </button>
                ) : (
                    ''
                )}
            </form>
            {document.creator === JSON.parse(localStorage.getItem('email')) && docAccess.length !== 0 ? <p className='text-xl font-medium my-4'>Shared with</p> : ''}
            <div className='flex flex-col gap-4'>
                {document.creator === JSON.parse(localStorage.getItem('email'))
                    ? docAccess.map((sharedWith) => {
                          return (
                              <div key={sharedWith} className=' border-b border-gray-800 flex items-center gap-5 p-2 max-w-[400px]'>
                                  <p className='flex-1'>{sharedWith}</p>
                                  <button disabled={isLoadingUnshare} className='bg-red-500 hover:bg-red-800 p-2 rounded-md' onClick={() => handleUnShare(document._id, sharedWith)}>
                                      <Trash2 size={18} />
                                  </button>
                              </div>
                          );
                      })
                    : ''}
            </div>
        </div>
    );
}
