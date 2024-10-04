import { it, expect, describe, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import Header from '../../src/components/Header.jsx';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';

describe('Header test', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('Should render header with correct H1', () => {
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/jsramverk/i);
  });
});
