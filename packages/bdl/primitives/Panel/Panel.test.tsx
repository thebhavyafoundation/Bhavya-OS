import { render } from '@testing-library/react';
import { Panel } from './Panel';

describe('Panel', () => {
  it('renders correctly', () => {
    const { container } = render(<Panel />);
    expect(container).toBeInTheDocument();
  });
});
