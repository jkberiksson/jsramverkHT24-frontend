import { useState } from 'react';

export default function CreateDocument({ documents, setDocuments }) {
    const [formData, setFormData] = useState({ title: '', content: '' });

    const handleSubmit = async (event) => {
        event.preventDefault();

        const dataToSubmit = {
            ...formData,
        };

        try {
            const res = await fetch(import.meta.env.VITE_BACKENDURL, {
                method: 'POST',
                body: JSON.stringify(dataToSubmit),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong!');
            }

            setDocuments([...documents, data]);
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
        <form
            onSubmit={handleSubmit}
            className='p-6 border border-gray-200 rounded-lg shadow-lg'>
            <label htmlFor='title' className='block text-lg font-semibold mb-2'>
                Title
            </label>
            <input
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                type='text'
                name='title'
                id='title'
                value={formData.title}
                onChange={handleInputChange}
                required
            />
            <label
                htmlFor='content'
                className='block text-lg font-semibold mb-2'>
                Content
            </label>
            <textarea
                required
                className='w-full h-40 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                name='content'
                id='content'
                value={formData.content}
                onChange={handleInputChange}></textarea>
            <button
                className='px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400'
                type='submit'>
                Create
            </button>
        </form>
    );
}
