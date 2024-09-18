import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Document() {
    const [document, setDocument] = useState({});
    const [docData, setDocData] = useState({ title: '', content: '' });
    const params = useParams();
    const id = params.id;

    const getDoc = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/${id}`);

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong!');
            }

            setDocument(data);
            setDocData({ title: data.title, content: data.content });
        } catch (error) {
            console.log(error);
        }
    };

    const handleInputChange = (event) => {
        const { target } = event;
        const { name, value } = target;

        setDocData({
            ...docData, // Keep existing form data
            [name]: value, // Update form data for the input field that changed
        });
    };

    const handleSave = async (event) => {
        event.preventDefault();

        const dataToSubmit = {
            ...docData,
        };

        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKENDURL}/${id}`,
                {
                    method: 'PUT',
                    body: JSON.stringify(dataToSubmit),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong!');
            }

            alert('Document updated');

            setDocument(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getDoc();
    }, []);

    return (
        <form
            onSubmit={handleSave}
            className='max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg mt-6'>
            {/* Title Input */}
            <div className='mb-4'>
                <label
                    htmlFor='title'
                    className='block text-lg font-semibold mb-2'>
                    Title
                </label>
                <input
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    type='text'
                    name='title'
                    id='title'
                    value={docData.title}
                    onChange={handleInputChange}
                    required
                />
            </div>

            {/* Content Textarea */}
            <div className='mb-4'>
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
                    value={docData.content}
                    onChange={handleInputChange}></textarea>
            </div>

            {/* Action Buttons */}
            <div className='flex justify-between mt-6'>
                <button
                    className='px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400'
                    type='submit'>
                    Save
                </button>
                <Link
                    to='/'
                    className='px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400'>
                    Back
                </Link>
            </div>
        </form>
    );
}
