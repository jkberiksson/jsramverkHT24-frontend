import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Trash2, XCircle } from 'react-feather';
import io from 'socket.io-client';

export default function Document({ setDocuments }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [docAccess, setDocAccess] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingUnshare, setIsLoadingUnshare] = useState(false);
    const [document, setDocument] = useState({});
    const [selectedText, setSelectedText] = useState();
    const [comments, setComments] = useState([]);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
    const [commentText, setCommentText] = useState('');
    const params = useParams();
    const navigate = useNavigate();
    const id = params.id;
    const origin = import.meta.env.VITE_BACKENDURL || 'http://localhost:3000';
    const socket = useRef(null);

    useEffect(() => {
        const getDoc = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKENDURL}/api/documents/${id}`,
                    {
                        headers: {
                            'x-access-token': JSON.parse(
                                localStorage.getItem('token')
                            ),
                        },
                    }
                );

                if (res.status === 401) {
                    localStorage.clear();
                    setDocuments([]);
                    navigate('/login');
                }

                const data = await res.json();

                if (
                    data.creator !== JSON.parse(localStorage.getItem('email'))
                ) {
                    if (
                        !data.docAccess.includes(
                            JSON.parse(localStorage.getItem('email'))
                        )
                    ) {
                        navigate('/');
                    }
                }

                if (data.message === 'No document found with the provided ID') {
                    navigate('/error');
                }

                if (!res.ok) {
                    throw new Error(
                        data.message || 'An error occurred. Please try again.'
                    );
                }

                setDocument(data);
                setTitle(data.title);
                setContent(data.content);
                setDocAccess(data.docAccess);
                setComments(data.docComments);
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        getDoc();
    }, [id]);

    const handleContentChange = (e) => {
        const updatedContent = e.target.value;
        setContent(updatedContent);
        socket.current.emit('send_message', {
            content: updatedContent,
            docId: id,
        });
    };

    const handleSelection = (e) => {
        const text = e.target;
        const start = text.selectionStart;
        const end = text.selectionEnd;
        const selected = text.value.substring(start, end);
        setSelectedText(selected);
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        if (selectedText) {
            setContextMenuPos({ x: e.clientX, y: e.clientY });
            setShowContextMenu(true);
        }
    };

    const handleAddComment = () => {
        if (selectedText && commentText) {
            const commentator = JSON.parse(localStorage.getItem('email'));
            const comment = `<${commentator}>: ${commentText}`;

            socket.current.emit('send_comment', {
                comment_array: comments,
                commentator: commentator,
                comment: comment,
                selectedText: selectedText,
                docId: id,
            });

            setComments([
                ...comments,
                {
                    commentator: commentator,
                    text: selectedText,
                    comment: comment,
                },
            ]);

            setSelectedText('');
            setCommentText('');
            setShowContextMenu(false);
        }
    };

    const handleRemoveComment = async (commentId) => {
        const dataToSubmit = {
            docId: id,
            commentId: commentId,
        };

        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKENDURL}/api/share/deletecomment`,
                {
                    method: 'PUT',
                    body: JSON.stringify(dataToSubmit),
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': JSON.parse(
                            localStorage.getItem('token')
                        ),
                    },
                }
            );

            if (res.status === 401) {
                localStorage.clear();
                setDocuments([]);
                navigate('/login');
            }

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || 'An error occurred. Please try again.'
                );
            }

            setComments(data.document.docComments);
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        socket.current = io.connect(origin);
        socket.current.emit('join_room', id);

        socket.current.on('receive_message', (data) => {
            setContent(data.content);
        });

        socket.current.on('receive_comment', (data) => {
            setComments([
                ...data.comment_array,
                {
                    commentator: data.commentator,
                    text: data.selectedText,
                    comment: data.comment,
                },
            ]);
        });

        return () => {
            socket.current.disconnect();
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = () => {
            setShowContextMenu(false);
        };

        if (showContextMenu) {
            window.document.addEventListener('click', handleClickOutside);
        } else {
            window.document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            window.document.removeEventListener('click', handleClickOutside);
        };
    }, [showContextMenu]);

    async function handleUnShare(id, email) {
        setIsLoadingUnshare(true);
        const dataToSubmit = {
            id,
            email,
        };

        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKENDURL}/api/share/unshare`,
                {
                    method: 'PUT',
                    body: JSON.stringify(dataToSubmit),
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': JSON.parse(
                            localStorage.getItem('token')
                        ),
                    },
                }
            );

            if (res.status === 401) {
                localStorage.clear();
                setDocuments([]);
                navigate('/login');
            }

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || 'An error occurred. Please try again.'
                );
            }

            setDocAccess(data.document.docAccess);
            setErrorMessage(null);

            if (
                document.creator !== JSON.parse(localStorage.getItem('email'))
            ) {
                navigate('/');
            }
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsLoadingUnshare(false);
        }
    }

    if (isLoading) {
        return (
            <div className='flex items-center justify-center my-4'>
                <div className='animate-spin rounded-full border-4 border-blue-600 border-t-transparent w-16 h-16'></div>
            </div>
        );
    }

    return (
        <div>
            <form className='py-6 border-b border-gray-800'>
                <h2 className='text-xl font-medium mb-4'>Edit Document</h2>
                {errorMessage && (
                    <div className='text-red-500 my-4'>{errorMessage}</div>
                )}
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
                />
                <label htmlFor='content' className='block text-lg mb-1'>
                    Content
                </label>
                <textarea
                    className='w-full mb-4 px-4 py-2 border h-52 border-gray-600 bg-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none'
                    name='content'
                    id='content'
                    value={content}
                    onChange={handleContentChange}
                    onSelect={handleSelection}
                    onContextMenu={handleContextMenu}></textarea>
                <p className='text-gray-600 text-xs'>
                    To add a comment: highlight the text you wish to comment on
                    and right click.
                </p>
                <Link
                    className='inline-block mt-4 px-6 py-2 border border-blue-700 rounded-lg focus:outline-none font-medium'
                    to='/'>
                    Back
                </Link>
                {
                    /* If showContextMenu is set to true by rightclicking selected text we show our own context menu to add a comment */
                    showContextMenu && (
                        <div
                            className='absolute bg-slate-100 border p-2 rounded shadow'
                            style={{
                                top: contextMenuPos.y,
                                left: contextMenuPos.x,
                            }}
                            onClick={(e) => e.stopPropagation()}>
                            <label className='text-black'>
                                Add Comment:
                                <input
                                    type='text'
                                    value={commentText}
                                    onChange={(e) =>
                                        setCommentText(e.target.value)
                                    }
                                    className='ml-2 p-1 border rounded'
                                />
                            </label>
                            <button
                                className='ml-2 p-1 bg-green-500 text-white rounded'
                                onClick={handleAddComment}>
                                Add
                            </button>
                        </div>
                    )
                }
                {document.creator !==
                JSON.parse(localStorage.getItem('email')) ? (
                    <button
                        disabled={isLoadingUnshare}
                        className='mt-4 px-6 py-2 border border-red-500 hover:border-red-800 bg-red-500 hover:bg-red-800 rounded-lg font-medium ml-4'
                        onClick={() =>
                            handleUnShare(
                                document._id,
                                JSON.parse(localStorage.getItem('email'))
                            )
                        }>
                        {isLoadingUnshare
                            ? 'Unsharing'
                            : 'Unshare from account'}
                    </button>
                ) : (
                    ''
                )}
            </form>
            <div className='mt-4'>
                {
                    /* If there are comments, then we map over them and add them */
                    comments.length > 0 && <h3 className='mb-2'>Comments:</h3>
                }
                <div className='flex flex-col gap-2'>
                    {comments.map((comment, index) => (
                        <div className='flex gap-4 items-center' key={index}>
                            {comment.commentator ===
                            JSON.parse(localStorage.getItem('email')) ? (
                                <div className='min-w-[24px] h-[24px] flex justify-center items-center'>
                                    <button
                                        disabled={isLoadingUnshare}
                                        className='bg-red-500 hover:bg-red-800 rounded-full'
                                        onClick={() =>
                                            handleRemoveComment(comment._id)
                                        }>
                                        <XCircle size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div className='min-w-[24px] h-[24px]'></div>
                            )}
                            <p>
                                <strong>{comment.text}: </strong>{' '}
                                {comment.comment}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            {document.creator === JSON.parse(localStorage.getItem('email')) &&
            docAccess.length !== 0 ? (
                <p className='text-xl font-medium my-4'>Shared with</p>
            ) : (
                ''
            )}
            <div className='flex flex-col gap-4'>
                {document.creator === JSON.parse(localStorage.getItem('email'))
                    ? docAccess.map((sharedWith) => {
                          return (
                              <div
                                  key={sharedWith}
                                  className=' border-b border-gray-800 flex items-center gap-5 p-2'>
                                  <button
                                      disabled={isLoadingUnshare}
                                      className='bg-red-500 hover:bg-red-800 p-2 rounded-md'
                                      onClick={() =>
                                          handleUnShare(
                                              document._id,
                                              sharedWith
                                          )
                                      }>
                                      <Trash2 size={18} />
                                  </button>
                                  <p className='flex-1'>{sharedWith}</p>
                              </div>
                          );
                      })
                    : ''}
            </div>
        </div>
    );
}
