import { render } from '@testing-library/react';
import { Text } from './Text';

describe('Text', () => {
  it('renders correctly', () => {
    const { container } = render(<Text />);
    expect(container).toBeInTheDocument();
  });
});
