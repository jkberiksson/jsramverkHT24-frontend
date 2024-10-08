import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateDocument({ documents, setDocuments }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const dataToSubmit = {
      title,
      content,
      creator: JSON.parse(localStorage.getItem('email')),
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/documents`, {
        method: 'POST',
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

      setDocuments([data, ...documents]);
      setTitle('');
      setContent('');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className='py-6 border-b border-gray-800' onSubmit={handleSubmit}>
      <h2 className='text-xl font-medium mb-4'>Create Document</h2>
      {errorMessage && <div className='text-red-500 mb-4'>{errorMessage}</div>}
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
        required
      />
      <label htmlFor='content' className='block text-lg mb-1'>
        Content
      </label>
      <textarea
        required
        className='w-full mb-4 px-4 py-2 border h-52 border-gray-600 bg-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none'
        name='content'
        id='content'
        value={content}
        onChange={(e) => setContent(e.target.value)}></textarea>
      <button
        className={`w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-center focus:outline-none ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        type='submit'
        disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
