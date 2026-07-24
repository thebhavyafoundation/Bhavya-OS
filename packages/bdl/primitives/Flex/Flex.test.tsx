import { render } from '@testing-library/react';
import { Flex } from './Flex';

describe('Flex', () => {
  it('renders correctly', () => {
    const { container } = render(<Flex />);
    expect(container).toBeInTheDocument();
  });
});
