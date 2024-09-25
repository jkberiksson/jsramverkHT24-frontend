import { it, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import Documents from '../../src/components/Documents.jsx';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';

describe('Documents tests', () => {
    const documents = [
        { _id: 1, title: 'title1', content: 'content1' },
        { _id: 2, title: 'title2', content: 'content2' },
        { _id: 3, title: 'title3', content: 'content3' },
        {
            _id: 4,
            title: 'title4',
            content:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur neque itaque deserunt excepturi quibusdam qui expedita maxime, impedit quos repellat accusamus perferendis delectus dolores porro fugiat ad atque dignissimos tempore corrupti? Sequi dolor porro obcaecati odit earum facere laboriosam et fugiat excepturi quam nam delectus tempora cupiditate consectetur itaque architecto aliquam, laborum est, reprehenderit aliquid. Perspiciatis rem ipsam est quasi iure nam facilis aliquam quo animi ut fuga nostrum iste alias earum, provident nesciunt eligendi eveniet architecto ipsum molestiae voluptatum modi optio quod dicta? Excepturi unde quidem suscipit et, impedit nemo consequuntur perferendis rem, aspernatur possimus, minus reprehenderit. Ratione, alias reiciendis, architecto ipsa nulla non ducimus reprehenderit adipisci doloremque maiores commodi sint nisi officiis velit, numquam delectus magnam natus eius facere placeat suscipit modi et nihil? Vel, dolorum minus quibusdam sit, quidem iste quasi, nostrum placeat aliquam sapiente beatae veniam ad molestias adipisci eveniet voluptates neque aliquid distinctio vero. Fuga!',
        },
    ];

    render(
        <MemoryRouter>
            <Documents documents={documents} />
        </MemoryRouter>
    );

    it('Should have elements with titles in the document', () => {
        documents.forEach((doc) => {
            const titleElement = screen.getByText(doc.title);
            expect(titleElement).toBeInTheDocument();
        });
    });

    it('Should have truncated and non truncated content in the document', () => {
        documents.forEach((doc) => {
            if (doc.content.length > 120) {
                const truncatedContent = `${doc.content.slice(0, 120)}...`;
                const contentElement = screen.getByText(truncatedContent);
                expect(contentElement).toBeInTheDocument();
            } else {
                const contentElement = screen.getByText(doc.content);
                expect(contentElement).toBeInTheDocument();
            }
        });
    });

    it('Should have links going to individual document', () => {
        documents.forEach((doc, index) => {
            const links = screen.getAllByRole('link');
            const linkElement = links[index];
            expect(linkElement).toHaveAttribute('href', `/${doc._id}`);
        });
    });
});
