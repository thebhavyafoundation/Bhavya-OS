import type { Meta, StoryObj } from '@storybook/react';
import { Surface } from './Surface';

const meta: Meta<typeof Surface> = {
  title: 'Primitives/Surface',
  component: Surface,
};
export default meta;

type Story = StoryObj<typeof Surface>;
export const Default: Story = {};
