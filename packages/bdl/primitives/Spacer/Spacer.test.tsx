import { render } from '@testing-library/react';
import { Spacer } from './Spacer';

describe('Spacer', () => {
  it('renders correctly', () => {
    const { container } = render(<Spacer />);
    expect(container).toBeInTheDocument();
  });
});
