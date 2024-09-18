import { useState } from 'react';

export default function CreateDocument({ documents, setDocuments }) {
    const [formData, setFormData] = useState({ title: '', content: '' });

    const handleSubmit = async (event) => {
        event.preventDefault();

        const dataToSubmit = {
            ...formData,
        };

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
        <form onSubmit={handleSubmit}>
            <label htmlFor='title'>Title</label>
            <input
                className='border'
                type='text'
                name='title'
                id='title'
                value={formData.title}
                onChange={handleInputChange}
                required
            />
            <label htmlFor='content'>Content</label>
            <textarea
                required
                className='border'
                name='content'
                id='content'
                value={formData.content}
                onChange={handleInputChange}></textarea>
            <button className='border' type='submit'>
                Create
            </button>
        </form>
    );
}
