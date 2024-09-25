import { it, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../../src/components/Header.jsx';
import '@testing-library/jest-dom/vitest';

describe('Header test', () => {
    it('Should render header with correct H1', () => {
        render(<Header />)
        const heading = screen.getByRole("heading");
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent(/jsramverk/i);
    })
});