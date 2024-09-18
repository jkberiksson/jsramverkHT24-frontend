import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className='mb-6 py-6'>
            <Link to='/'>
                <h1 className='text-2xl font-medium inline-block underline'>
                    JSramverk
                </h1>
            </Link>
        </header>
    );
}
