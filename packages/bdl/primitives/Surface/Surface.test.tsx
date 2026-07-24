import { render } from '@testing-library/react';
import { Surface } from './Surface';

describe('Surface', () => {
  it('renders correctly', () => {
    const { container } = render(<Surface />);
    expect(container).toBeInTheDocument();
  });
});
