import { it, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Document from '../../src/components/Document.jsx';
import { MemoryRouter } from 'react-router-dom';

// Mock the fetch API
/* global.fetch = vi.fn(() =>
    Promise.resolve({
        ok: true,
        json: () =>
            Promise.resolve({ _id: 1, title: 'title1', content: 'content1' }),
    })
); */

describe('Document test', () => {
    render(
        <MemoryRouter>
            <Document />
        </MemoryRouter>
    );

    /* it('Should have correct display value and be in the document', () => {
        const input = screen.getByRole('input');
        expect(input).toBeInTheDocument();
    }); */

    it('Should have link going back to homepage', () => {
        const linkElement = screen.getByRole('link');
        expect(linkElement).toHaveTextContent('Back');
        expect(linkElement).toHaveAttribute('href', '/');
    });

    it('Should have save button', () => {
        const saveButton = screen.getByRole('button');
        expect(saveButton).toHaveTextContent('Save');
        expect(saveButton).toBeInTheDocument();
    });
});
