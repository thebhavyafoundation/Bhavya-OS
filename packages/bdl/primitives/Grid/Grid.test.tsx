import { render } from '@testing-library/react';
import { Grid } from './Grid';

describe('Grid', () => {
  it('renders correctly', () => {
    const { container } = render(<Grid />);
    expect(container).toBeInTheDocument();
  });
});
