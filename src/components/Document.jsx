import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Document() {
    const [document, setDocument] = useState({});
    const [docData, setDocData] = useState({ title: '', content: '' });
    const params = useParams();
    const id = params.id;

    const handleInputChange = (event) => {
        const { target } = event;
        const { name, value } = target;

        setDocData({
            ...docData,
            [name]: value,
        });
    };

    const handleSave = async (event) => {
        event.preventDefault();

        const dataToSubmit = {
            ...docData,
        };

        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKENDURL}documents/${id}`,
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

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    useEffect(() => {
        const getDoc = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKENDURL}/documents/${id}`
                );

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
        getDoc();
    }, [id]);

    return (
        <form className='py-6 border-b border-gray-800' onSubmit={handleSave}>
            <div>
                <label htmlFor='title' className='block text-lg mb-1'>
                    Title
                </label>
                <input
                    className='w-full mb-4 px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none'
                    type='text'
                    name='title'
                    id='title'
                    value={docData.title}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label htmlFor='content' className='block text-lg mb-1'>
                    Content
                </label>
                <textarea
                    className='w-full mb-4 px-4 py-2 border h-52 border-gray-600 bg-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none'
                    required
                    name='content'
                    id='content'
                    value={docData.content}
                    onChange={handleInputChange}></textarea>
            </div>
            <p className='text-gray-500 text-xs sm:text-sm mt-2'>
                Updated at: {formatDate(document.updatedAt)}
            </p>
            <div className='flex items-center gap-4 mt-4'>
                <button
                    className='px-6 py-2 border border-blue-600 bg-blue-600 hover:bg-blue-700 hover:border-blue-700 rounded-lg font-medium focus:outline-none'
                    type='submit'>
                    Save
                </button>
                <Link
                    className='px-6 py-2 border border-blue-700 rounded-lg focus:outline-none  font-medium'
                    to='/'>
                    Back
                </Link>
            </div>
        </form>
    );
}
