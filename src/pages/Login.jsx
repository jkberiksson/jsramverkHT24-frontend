import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();

        const dataToSubmit = { email, password };

        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKENDURL}/login`,
                {
                    method: 'POST',
                    body: JSON.stringify(dataToSubmit),
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong!');
            }

            setEmail('');
            setPassword('');

            localStorage.setItem('token', JSON.stringify(data.token));
            localStorage.setItem('email', JSON.stringify(data.email));

            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1 className='text-3xl mb-5'>Login</h1>
            <label className='block text-lg font-semibold mb-2' htmlFor=''>
                Email
            </label>
            <input
                type='text'
                name='email'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <label className='block text-lg font-semibold mb-2' htmlFor=''>
                Password
            </label>
            <input
                type='password'
                name='password'
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <button
                className='px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400'
                type='submit'>
                Login
            </button>
            <Link to='/register'>
                <p>Not a member? Register!</p>
            </Link>
        </form>
    );
}
