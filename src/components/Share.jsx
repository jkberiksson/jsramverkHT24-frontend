import { useState, useEffect } from 'react';
import { X } from 'react-feather';
import { useNavigate } from 'react-router-dom';

export default function Share({ setToggleShare, id, setDocuments }) {
    const [email, setEmail] = useState('');
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getUsers = async () => {
            setErrorMessage(null);
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/users`, {
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

                if (!res.ok) {
                    throw new Error(data.message || 'An error occurred. Please try again.');
                }

                setUsers(data);
            } catch (error) {
                setErrorMessage(error.message);
            }
        };

        getUsers();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        setErrorMessage(null);
        setIsSubmitting(true);

        const dataToSubmit = {
            id,
            recipient: email,
            sender: JSON.parse(localStorage.getItem('email')),
        };

        try {
            if (!email) {
                throw new Error('Please provide an email!');
            }

            const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/share`, {
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

            setSuccessMessage(data.message);

            setTimeout(() => {
                setToggleShare(false);
                setSuccessMessage(null);
            }, 3000);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div onClick={() => setToggleShare(false)} className='w-screen h-screen fixed left-0 top-0 bg-black bg-opacity-80 z-10 flex items-center justify-center'>
            <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className='relative p-8 bg-opacity-100 w-11/12 max-w-md bg-gray-800 shadow-lg rounded-lg z-20'>
                <h1 className='text-2xl font-medium text-center text-white mb-6'>Share Document</h1>
                <div className='absolute right-3 top-3 p-1 rounded-md cursor-pointer mt-0 bg-blue-500 hover:bg-blue-600' onClick={() => setToggleShare(false)}>
                    <X size={18} />
                </div>
                {errorMessage && <div className='text-red-500 text-center mb-6'>{errorMessage}</div>}
                {successMessage && <div className='text-green-500 text-center mb-6'>{successMessage}</div>}
                <div>
                    <select
                        name='email'
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full mb-6 px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none'>
                        <option value='' disabled>
                            Select a recipient
                        </option>
                        {users
                            .filter((user) => user.email !== JSON.parse(localStorage.getItem('email')))
                            .map((user, index) => (
                                <option key={index} value={user.email}>
                                    {user.email}
                                </option>
                            ))}
                    </select>
                </div>
                <div>
                    <button
                        type='submit'
                        className={`w-full px-6 py-3 mb-6 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-center text-white focus:outline-none ${
                            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={isSubmitting}>
                        {isSubmitting ? 'Sharing...' : 'Share'}
                    </button>
                </div>
            </form>
        </div>
    );
}
