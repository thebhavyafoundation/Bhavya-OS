import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container';

const meta: Meta<typeof Container> = {
  title: 'Primitives/Container',
  component: Container,
};
export default meta;

type Story = StoryObj<typeof Container>;
export const Default: Story = {};
