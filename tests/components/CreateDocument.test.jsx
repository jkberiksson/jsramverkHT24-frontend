import { it, expect, describe, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import CreateDocument from '../../src/components/CreateDocument.jsx';
import '@testing-library/jest-dom/vitest';

describe('CreateDocument', () => {
    let documents = [];
    let setDocuments = vi.fn();

    beforeEach(() => {
        render(
            <CreateDocument documents={documents} setDocuments={setDocuments} />
        );
    });

    afterEach(() => {
        cleanup();
    });

    it('should render a form with the inputs and a button', () => {
        const input = screen.getByLabelText(/title/i);
        expect(input).toBeInTheDocument();

        const textarea = screen.getByLabelText(/content/i);
        expect(textarea).toBeInTheDocument();

        const button = screen.getByRole('button', { name: /create/i });
        expect(button).toBeInTheDocument();
    });

    it('should update input fields when user types', () => {
        const input = screen.getByLabelText(/title/i);
        fireEvent.change(input, { target: { value: 'Testing title' } });
        expect(input.value).toBe('Testing title');

        const textarea = screen.getByLabelText(/content/i);
        fireEvent.change(textarea, { target: { value: 'Testing Content' } });
        expect(textarea.value).toBe('Testing Content');
    });

    it('should have empty fields on successful submission', async () => {
        const input = screen.getByLabelText(/title/i);
        const textarea = screen.getByLabelText(/content/i);
        const button = screen.getByRole('button', { name: /create/i });

        fireEvent.click(button);

        expect(input.value).toBe('');
        expect(textarea.value).toBe('');
    });
});