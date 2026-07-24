import { render } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders correctly', () => {
    const { container } = render(<Card />);
    expect(container).toBeInTheDocument();
  });
});
