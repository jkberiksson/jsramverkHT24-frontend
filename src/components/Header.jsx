import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
    const email = localStorage.getItem('email');
    const parsedEmail = JSON.parse(email);

    function logout() {
        localStorage.clear();
        navigate('/login');
    }

    return (
        <header className='mb-6 py-6 flex justify-between'>
            <h1 className='text-2xl font-medium inline-block underline'>
                JSramverk
            </h1>

            {parsedEmail && (
                <div className='flex items-center gap-6'>
                    <h3>{parsedEmail}</h3>
                    <button
                        onClick={logout}
                        className='px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400'>
                        Logout
                    </button>
                </div>
            )}
        </header>
    );
}
