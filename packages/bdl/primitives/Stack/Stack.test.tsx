import { render } from '@testing-library/react';
import { Stack } from './Stack';

describe('Stack', () => {
  it('renders correctly', () => {
    const { container } = render(<Stack />);
    expect(container).toBeInTheDocument();
  });
});
