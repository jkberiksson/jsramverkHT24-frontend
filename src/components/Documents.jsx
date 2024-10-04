import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Edit, Share } from 'react-feather';

export default function Documents({ documents, setDocuments, handleShare }) {
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/documents/${id}`, {
        method: 'DELETE',
        headers: {
          'x-access-token': JSON.parse(localStorage.getItem('token')),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong!');
      }

      setDocuments(documents.filter((doc) => doc._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  useEffect(() => {
    const getDocs = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/documents`, {
          headers: {
            'x-access-token': JSON.parse(localStorage.getItem('token')),
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Something went wrong!');
        }

        data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        setDocuments(data);
      } catch (error) {
        console.log(error);
      }
    };

    getDocs();
  }, [setDocuments]);

  return (
    <div>
      {documents.map((document) => {
        return (
          <div className='border-b border-gray-800 rounded-sm my-3 p-3 flex justify-between items-center gap-12' key={document._id}>
            <div>
              <h1 className='text-base md:text-xl font-medium mb-2'>{document.title}</h1>
              <p className='text-gray-400 font-light'>
                {document.content.length > 120 ? `${document.content.slice(0, 120)}...` : document.content}
              </p>
              <p className='text-gray-600 text-xs mt-5'>Updated at: {formatDate(document.updatedAt)}</p>
              <p className='text-gray-600 text-xs mt-5'>Creator: {document.creator}</p>
            </div>
            <div className='flex gap-3'>
              <Link className='bg-green-500 hover:bg-green-600 p-2 rounded-md' to={`/${document._id}`}>
                <Edit size={18} />
              </Link>
              <button className='bg-blue-500 hover:bg-blue-600 p-2 rounded-md' onClick={() => handleShare(document._id)}>
                <Share size={18} />
              </button>
              <button className='bg-red-500 hover:bg-red-600 p-2 rounded-md' onClick={() => handleDelete(document._id)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
