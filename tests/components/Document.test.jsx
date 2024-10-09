import { it, expect, describe, vi, afterEach, beforeEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Document from '../../src/components/Document.jsx';
import { MemoryRouter } from 'react-router-dom';

describe('Document test', () => {
    // Mock the fetch API
    beforeEach(() => {
        window.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ _id: 1, title: 'title1', content: 'content1' }),
            })
        );

        render(
            <MemoryRouter>
                <Document />
            </MemoryRouter>
        );
    });

    afterEach(() => {
        cleanup();
    });

    it('Should have correct input and textarea values and be in the document', async () => {
        const textbox = await screen.findAllByRole('textbox');
        const content = screen.getByText(/content1/i);
        const title = screen.getByDisplayValue(/title1/i);

        expect(textbox[0]).toBeInTheDocument();
        expect(textbox[1]).toBeInTheDocument();
        expect(content).toBeInTheDocument();
        expect(title).toBeInTheDocument();
    });

    it('Should have link going back to homepage', async () => {
        const linkElement = await screen.findByRole('link');
        expect(linkElement).toHaveTextContent('Back');
        expect(linkElement).toHaveAttribute('href', '/');
    });

    it('Should have save button', async () => {
        const saveButton = await screen.findByRole('button');
        expect(saveButton).toHaveTextContent('Save');
        expect(saveButton).toBeInTheDocument();
    });
});
