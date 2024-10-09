import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        setErrorMessage(null);
        setIsSubmitting(true);

        const dataToSubmit = { email, password };

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/login`, {
                method: 'POST',
                body: JSON.stringify(dataToSubmit),
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'An error occurred. Please try again.');
            }

            localStorage.setItem('token', JSON.stringify(data.token));
            localStorage.setItem('email', JSON.stringify(data.email));

            setEmail('');
            setPassword('');
            navigate('/');
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-md p-8 space-y-6 bg-gray-800 shadow-lg rounded-lg'>
            <h1 className='text-2xl font-medium text-center'>Login</h1>
            {errorMessage && <div className='text-red-500 text-center'>{errorMessage}</div>}
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label className='block text-sm font-medium text-gray-400' htmlFor='email'>
                        Email
                    </label>
                    <input
                        type='text'
                        name='email'
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full mt-1 px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none'
                        placeholder='you@example.com'
                        disabled={isSubmitting}
                    />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-400' htmlFor='password'>
                        Password
                    </label>
                    <input
                        type='password'
                        name='password'
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-full mt-1 px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none'
                        placeholder='••••••••'
                        disabled={isSubmitting}
                    />
                </div>
                <div>
                    <button
                        type='submit'
                        className={`w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-center focus:outline-none ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </form>
            <div className='text-center'>
                <p className='text-gray-400'>
                    Not a member?{' '}
                    <Link to='/register' className='text-blue-500 hover:underline'>
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
