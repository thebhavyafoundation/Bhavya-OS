import { render } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders correctly', () => {
    const { container } = render(<Avatar />);
    expect(container).toBeInTheDocument();
  });
});
