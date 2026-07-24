import { render } from '@testing-library/react';
import { Container } from './Container';

describe('Container', () => {
  it('renders correctly', () => {
    const { container } = render(<Container />);
    expect(container).toBeInTheDocument();
  });
});
