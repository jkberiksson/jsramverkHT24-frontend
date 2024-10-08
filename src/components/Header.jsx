import { useNavigate } from 'react-router-dom';

export default function Header({ setDocuments }) {
  const navigate = useNavigate();
  const email = localStorage.getItem('email');
  const parsedEmail = JSON.parse(email);

  function logout() {
    localStorage.clear();
    setDocuments([]);
    navigate('/login');
  }

  return (
    <header className='mb-6 py-6 flex justify-between'>
      <h1 className='text-2xl font-medium'>JSramverk</h1>

      {parsedEmail && (
        <div className='flex items-center gap-6'>
          <p>{parsedEmail}</p>
          <button onClick={logout} className='w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-center focus:outline-none'>
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
