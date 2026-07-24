import { render } from '@testing-library/react';
import { Icon } from './Icon';

describe('Icon', () => {
  it('renders correctly', () => {
    const { container } = render(<Icon />);
    expect(container).toBeInTheDocument();
  });
});
