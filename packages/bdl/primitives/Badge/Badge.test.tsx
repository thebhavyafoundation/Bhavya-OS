import { render } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders correctly', () => {
    const { container } = render(<Badge />);
    expect(container).toBeInTheDocument();
  });
});
