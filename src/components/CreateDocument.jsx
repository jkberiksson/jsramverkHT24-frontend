import { useState } from 'react';

export default function CreateDocument({ documents, setDocuments }) {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const email = JSON.parse(localStorage.getItem('email'));

  const handleSubmit = async (event) => {
    event.preventDefault();

    const dataToSubmit = {
      ...formData,
      creator: email,
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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong!');
      }

      setDocuments([data, ...documents]);
      setFormData({ title: '', content: '' });
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event) => {
    const { target } = event;
    const { name, value } = target;

    setFormData({
      ...formData, // Keep existing form data
      [name]: value, // Update form data for the input field that changed
    });
  };

  return (
    <form className='py-6 border-b border-gray-800' onSubmit={handleSubmit}>
      <label htmlFor='title' className='block text-lg mb-1'>
        Title
      </label>
      <input
        className='w-full mb-4 px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none'
        type='text'
        name='title'
        id='title'
        value={formData.title}
        onChange={handleInputChange}
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
        value={formData.content}
        onChange={handleInputChange}></textarea>
      <button
        className='w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-center focus:outline-none'
        type='submit'>
        Create
      </button>
    </form>
  );
}
