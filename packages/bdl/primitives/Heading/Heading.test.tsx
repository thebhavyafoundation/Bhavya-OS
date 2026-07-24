import { render } from '@testing-library/react';
import { Heading } from './Heading';

describe('Heading', () => {
  it('renders correctly', () => {
    const { container } = render(<Heading />);
    expect(container).toBeInTheDocument();
  });
});
