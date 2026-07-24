import { render } from '@testing-library/react';
import { Link } from './Link';

describe('Link', () => {
  it('renders correctly', () => {
    const { container } = render(<Link />);
    expect(container).toBeInTheDocument();
  });
});
