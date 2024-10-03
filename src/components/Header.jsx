export default function Header() {
    return (
        <header className='mb-6 py-6 flex justify-between'>
            <h1 className='text-2xl font-medium inline-block underline'>
                JSramverk
            </h1>
            <button className='px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400'>
                Logout
            </button>
        </header>
    );
}
