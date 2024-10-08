import { Link } from 'react-router-dom';

export default function Error() {
  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center text-center'>
      <h1 className='text-xl font-bold mb-4'>Oops! Something went wrong.</h1>
      <p className='mb-6'>We can&apos;t seem to find the page you&apos;re looking for.</p>
      <div className='flex items-center justify-center gap-4'>
        <Link to='/'>
          <button className='px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg'>Go to Home</button>
        </Link>
        <button onClick={() => window.location.reload()} className='px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg'>
          Retry
        </button>
      </div>
    </div>
  );
}
