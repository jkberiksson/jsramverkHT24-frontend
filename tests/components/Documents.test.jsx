import { it, expect, describe } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Documents from '../../src/components/Documents.jsx';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';

describe('Documents tests', () => {
    it('Should have doc text and titles in the document', () => {
        const documents = [
            {_id: 1, title:"title1", content:"content1"},
            {_id: 2, title:"title2", content:"content2"},
            {_id: 3, title:"title3", content:"content3"}
        ]

        render(
            <MemoryRouter>
               <Documents documents={documents}/>
            </MemoryRouter>
        );

        documents.forEach((doc, index)=> {
            const content = doc.content;
            expect(screen.getAllByText(/content/i)).toBeDefined();
            expect(screen.getByText(content)).toBeInTheDocument();
            
            const titleElement = screen.getByText(doc.title);
            expect(titleElement).toBeInTheDocument();

            const links = screen.getAllByRole('link');
            const linkElement = links[index];
            expect(linkElement).toHaveAttribute('href', `/${doc._id}`);
        });
    })
});
