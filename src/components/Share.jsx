import { useState, useRef } from 'react';

export default function Share({ setToggleShare, id }) {
  const [email, setEmail] = useState('');
  const ref = useRef();

  async function handleSubmit(event) {
    event.preventDefault();

    const dataToSubmit = {
      id,
      email,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/documents/share`, {
        method: 'PUT',
        body: JSON.stringify(dataToSubmit),
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': JSON.parse(localStorage.getItem('token')),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong!');
      }

      setToggleShare(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      ref={ref}
      onClick={() => setToggleShare(false)}
      className='w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-80 z-10 flex items-center justify-center'>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className='space-y-6 p-8 bg-opacity-100 w-11/12 max-w-md bg-gray-800 shadow-lg rounded-lg z-20'>
        <h1 className='text-2xl font-medium text-center text-white'>Share Document</h1>
        <div>
          <input
            type='email'
            name='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full mt-1 px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none'
            placeholder='Enter recipient email'
          />
        </div>
        <div>
          <button
            type='submit'
            className='w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-center text-white focus:outline-none'>
            Share
          </button>
        </div>
      </form>
    </div>
  );
}
